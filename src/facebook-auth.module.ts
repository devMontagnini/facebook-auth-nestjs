import { Module, HttpModule, DynamicModule, HttpService } from "@nestjs/common";
import { FACEBOOK_AUTH_CONFIG_MODULE_TOKEN, FACEBOOK_AUTH_SERVICE_TOKEN } from "./config/config.constants";
import { ConfigModule } from "./config/config.module";
import { ConfigModuleAsync } from "./config/config.module.async";
import { FacebookAuthHostModule } from "./facebook-auth-host.module";
import { FacebookAuthService } from "./facebook-auth.service";

@Module({
  providers: [{
    provide: FacebookAuthService,
    useExisting: FACEBOOK_AUTH_SERVICE_TOKEN
  }],
  exports: [FacebookAuthService],
})
export class FacebookAuthModule {

  static forRoot(config: ConfigModule): DynamicModule {
    return {
      module: FacebookAuthModule,
      imports: [FacebookAuthHostModule.forRoot(config)],
    }
  }

  static forRootAsync(config: ConfigModuleAsync): DynamicModule {
    return {
      module: FacebookAuthModule,
      imports: [FacebookAuthHostModule.forRootAsync(config)],
    }
  }

  static forFeature(config: ConfigModule): DynamicModule {
    return this.buildFeature(config);
  }

  static forFeatureAsync(config: ConfigModuleAsync): DynamicModule {
    return this.buildFeature(config);
  }

  private static buildFeature(config: ConfigModule | ConfigModuleAsync) {
    const module: DynamicModule = {
      module: FacebookAuthModule,
      imports: [HttpModule.register({
        validateStatus: () => true,
      })],
      providers: [{
        provide: FacebookAuthService,
        inject: [FACEBOOK_AUTH_CONFIG_MODULE_TOKEN, HttpService],
        useFactory: (config: ConfigModule, httpService: HttpService) => {
          return new FacebookAuthService(config, httpService);
        },
      }]
    };

    const isSyncConfig = !('useFactory' in config);
    if(isSyncConfig) { 
      module.providers = module.providers.concat([{
        provide: FACEBOOK_AUTH_CONFIG_MODULE_TOKEN,
        useValue: config
      }])
    } else {
      const asyncConfig = config as ConfigModuleAsync;
      module.imports = module.imports.concat(asyncConfig?.imports || []);
      module.providers = module.providers.concat([{
        provide: FACEBOOK_AUTH_CONFIG_MODULE_TOKEN,
        useFactory: asyncConfig?.useFactory,
        inject: asyncConfig?.inject
      }]);
    }

    return module;
  }

}