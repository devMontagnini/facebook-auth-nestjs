import { FACEBOOK_AUTH_GRAPH_URL, FACEBOOK_AUTH_DEBUG_TOKEN_URL, FACEBOOK_AUTH_ACCESS_TOKEN_URL, FACEBOOK_AUTH_CONFIG_MODULE_TOKEN } from "./config/config.constants";
import { Injectable, HttpService, Inject, HttpStatus } from "@nestjs/common";
import { UserValidateResponse } from "./responses/user-validate.response";
import { AppTokenResponse } from "./responses/app-token.response";
import { ConfigModule } from "./config/config.module";
import { InvalidUserException } from "./exceptions/invalid-user.exception";
import { AppTokenException } from "./exceptions/app-token.exception";
import { GetUserFieldsException } from "./exceptions/get-user-fields.exception";
import { SelectedFields } from "./types/selected-fields.type";
import { Fields } from "./types/fields.type";
import { UserResponse } from "./responses/user.response";
import { UserValidateException } from "./exceptions/user-validate.exception";

@Injectable()
export class FacebookAuthService {

  constructor(
    @Inject(FACEBOOK_AUTH_CONFIG_MODULE_TOKEN) 
    private readonly configModule: ConfigModule,
    private readonly httpService: HttpService,
  ) { }

  async getUser<T extends Fields>(accessToken: string, ...fields: T[]): Promise<SelectedFields<T>> {
    const appToken = await this.getAppToken();
    const user = (await this.userValidate(accessToken, appToken));
    return await this.getUserFields<SelectedFields<T>>(user.user_id, accessToken, fields);
  }

  private async getUserFields<T>(userId: string, accessToken: string, fields: Fields[]): Promise<T> {
    const result = await this.httpService.get<T>(
      `${FACEBOOK_AUTH_GRAPH_URL}${userId}`,
      { params: {
        fields: fields.join(', '),
        access_token: accessToken,
      }})
      .toPromise();

    if(result.status !== HttpStatus.OK) {
      throw new GetUserFieldsException();
    }

    return result?.data;
  }

  private async userValidate(accessToken: string, appToken: string): Promise<UserResponse> {
    const result = await this.httpService.get<UserValidateResponse>(
      FACEBOOK_AUTH_DEBUG_TOKEN_URL,
      { params: {
        input_token: accessToken,
        access_token: appToken,
      }})
      .toPromise();
    
    if(result.status !== HttpStatus.OK) {
      throw new UserValidateException();
    }

    const userData = result.data?.data;
    if(!userData ||
      !userData.user_id ||
      !userData.is_valid || 
      userData.app_id != this.configModule.clientId) {
        throw new InvalidUserException();
    }

    return userData;
  }

  private async getAppToken(): Promise<string> {
    const result = await this.httpService.get<AppTokenResponse>(
      FACEBOOK_AUTH_ACCESS_TOKEN_URL,
      { params: {
          grant_type: 'client_credentials',
          client_id: this.configModule.clientId,
          client_secret: this.configModule.clientSecret,
      }})
      .toPromise();
    
    if(result.status !== HttpStatus.OK) {
      throw new AppTokenException();
    }

    return result.data.access_token;
  }

}