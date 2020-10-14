import { FACEBOOK_GRAPH_URL, FACEBOOK_DEBUG_TOKEN_URL, FACEBOOK_ACCESS_TOKEN_URL, FACEBOOK_CONFIG_MODULE_TOKEN } from "./config/config.constants";
import { Injectable, HttpService, Inject } from "@nestjs/common";
import { AuthValidateResponse } from "./responses/auth-validate.response";
import { AppTokenResponse } from "./responses/app-token.response";
import { ConfigModule } from "./config/config.module";
import { InvalidUserException } from "./exceptions/invalid-user.exception";
import { AppTokenException } from "./exceptions/app-token.exception";
import { GetUserFieldsException } from "./exceptions/get-user-fields.exception";
import { SelectedFields } from "./types/selected-fields.type";
import { Fields } from "./types/fields.type";

@Injectable()
export class FacebookService {

  constructor(
    @Inject(FACEBOOK_CONFIG_MODULE_TOKEN) 
    private readonly configModule: ConfigModule,
    private readonly httpService: HttpService,
  ) { }

  async getUser<T extends Fields>(accessToken: string, ...fields: T[]): Promise<SelectedFields<T>> {
    const appToken = await this.getAppToken();
    if(!appToken) {
      throw new AppTokenException();
    }

    const authValidate = (await this.authValidate(accessToken, appToken)).data;
    if(!authValidate ||
      !authValidate.user_id ||
      !authValidate.is_valid || 
      authValidate.app_id != this.configModule.clientId) {
        throw new InvalidUserException();
    }

    const userId = authValidate.user_id;
    const userFields = await this.getUserFields<SelectedFields<T>>(userId, accessToken, fields);
    if(!userFields) {
      throw new GetUserFieldsException();
    }

    return userFields;
  }

  private async getUserFields<T>(userId: string, accessToken: string, fields: Fields[]): Promise<T> {
    const result = await this.httpService.get<T>(
      `${FACEBOOK_GRAPH_URL}${userId}`,
      { params: {
        fields: fields.join(', '),
        access_token: accessToken,
      }})
      .toPromise();
    return result?.data;
  }

  private async authValidate(accessToken: string, appToken: string): Promise<AuthValidateResponse> {
    const result = await this.httpService.get<AuthValidateResponse>(
      FACEBOOK_DEBUG_TOKEN_URL,
      { params: {
        input_token: accessToken,
        access_token: appToken,
      }})
      .toPromise();
    return result?.data;
  }

  private async getAppToken(): Promise<string> {
    const result = await this.httpService.get<AppTokenResponse>(
      FACEBOOK_ACCESS_TOKEN_URL,
      { params: {
          grant_type: 'client_credentials',
          client_id: this.configModule.clientId,
          client_secret: this.configModule.clientSecret,
      }})
      .toPromise();
    return result?.data?.access_token;
  }

}