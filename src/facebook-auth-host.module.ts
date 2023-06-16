import { HttpModule } from "@nestjs/axios";
import { Module, DynamicModule, Global } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { ConfigModuleAsync } from "./config/config.module.async";
import { FACEBOOK_AUTH_CONFIG_MODULE_TOKEN, FACEBOOK_AUTH_SERVICE_TOKEN } from "./config/config.constants";
import { FacebookAuthService } from "./facebook-auth.service";

@Global()
@Module({
  imports: [HttpModule.register({
    validateStatus: () => true,
  })],
  providers: [
    {
      provide: FACEBOOK_AUTH_CONFIG_MODULE_TOKEN,
      useValue: null,
    },
    {
      provide: FACEBOOK_AUTH_SERVICE_TOKEN,
      useClass: FacebookAuthService,
    },
  ],
  exports: [FACEBOOK_AUTH_SERVICE_TOKEN]
})
export class FacebookAuthHostModule { 

  static forRoot(config: ConfigModule): DynamicModule {
    return {
      module: FacebookAuthHostModule,
      providers: [{
        provide: FACEBOOK_AUTH_CONFIG_MODULE_TOKEN,
        useValue: config,
      }]
    }
  }

  static forRootAsync(config: ConfigModuleAsync): DynamicModule {
    return {
      module: FacebookAuthHostModule,
      imports: config.imports,
      providers: [{
        provide: FACEBOOK_AUTH_CONFIG_MODULE_TOKEN,
        useFactory: config?.useFactory,
        inject: config?.inject,
      }],
    }
  }

}