import { Module, DynamicModule, Global } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { ConfigModuleAsync } from "./config/config.module.async";
import { FACEBOOK_CONFIG_MODULE_TOKEN, FACEBOOK_SERVICE_TOKEN } from "./config/config.constants";
import { FacebookService } from "./facebook.service";

@Global()
@Module({
  providers: [
    {
      provide: FACEBOOK_CONFIG_MODULE_TOKEN,
      useValue: null,
    },
    {
      provide: FACEBOOK_SERVICE_TOKEN,
      useClass: FacebookService,
    }
  ],
  exports: [FACEBOOK_SERVICE_TOKEN]
})
export class FacebookHostModule { 

  static forRoot(config: ConfigModule): DynamicModule {
    return {
      module: FacebookHostModule,
      providers: [{
        provide: FACEBOOK_CONFIG_MODULE_TOKEN,
        useValue: config,
      }]
    }
  }

  static forRootAsync(config: ConfigModuleAsync): DynamicModule {
    return {
      module: FacebookHostModule,
      imports: config.imports,
      providers: [{
        provide: FACEBOOK_CONFIG_MODULE_TOKEN,
        useFactory: config?.useFactory,
        inject: config?.inject,
      }],
    }
  }

}