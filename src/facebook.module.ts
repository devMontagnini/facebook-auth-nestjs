import { Module, HttpModule, DynamicModule, HttpService } from "@nestjs/common";
import { FACEBOOK_CONFIG_MODULE_TOKEN, FACEBOOK_SERVICE_TOKEN } from "./config/config.constants";
import { ConfigModule } from "./config/config.module";
import { ConfigModuleAsync } from "./config/config.module.async";
import { FacebookHostModule } from "./facebook-host.module";
import { FacebookService } from "./facebook.service";

@Module({
  imports: [HttpModule],
  providers: [{
    provide: FacebookService,
    useExisting: FACEBOOK_SERVICE_TOKEN
  }],
  exports: [FacebookService],
})
export class FacebookModule {

  static forRoot(config: ConfigModule): DynamicModule {
    return {
      module: FacebookModule,
      imports: [FacebookHostModule.forRoot(config)],
    }
  }

  static forRootAsync(config: ConfigModuleAsync): DynamicModule {
    return {
      module: FacebookModule,
      imports: [FacebookHostModule.forRootAsync(config)],
    }
  }

  static forFeature(config: ConfigModule): DynamicModule {
    return {
      module: FacebookModule,
      providers: [
        {
          provide: FACEBOOK_CONFIG_MODULE_TOKEN,
          useValue: config
        },
        {
          provide: FacebookService,
          inject: [HttpModule, FACEBOOK_CONFIG_MODULE_TOKEN],
          useFactory: (httpService: HttpService, config: ConfigModule) => {
            return new FacebookService(config, httpService);
          },
        }
      ]
    };
  }

  static forFeatureAsync(config: ConfigModuleAsync): DynamicModule {
    return {
      module: FacebookModule,
      imports: config.imports,
      providers: [
        {
          provide: FACEBOOK_CONFIG_MODULE_TOKEN,
          useFactory: config.useFactory,
          inject: config.inject
        },
        {
          provide: FacebookService,
          inject: [HttpModule, FACEBOOK_CONFIG_MODULE_TOKEN],
          useFactory: (httpService: HttpService, config: ConfigModule) => {
            return new FacebookService(config, httpService);
          },
        }
      ]
    };
  }

}