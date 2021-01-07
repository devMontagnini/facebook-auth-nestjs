# facebook-auth-nestjs

## Description
Facebook login package for NestJs

## Instalation
```npm i facebook-auth-nestjs```

## Quick Start


1. Create your Facebook's app and get your credentials (clientId and clientSecret) from Facebook's panel.

2. Import <b>FacebookAuthModule</b> on your NestJs module and use <b>forRoot</b> or <b>forRootAsync</b> static methods for initial configuration <i>(configure using your clientId and clientSecret from Facebook's panel)</i>. 
``` js
import { FacebookAuthModule } from 'facebook-auth-nestjs';

@Module({
  imports: [
    FacebookAuthModule.forRoot({
      clientId: your-facebook-clientid,
      clientSecret: your-facebook-client-secret,
    }),
  ],
})
export class AppModule { }
```

3. Import <b>FacebookAuthService</b> on your service or controller and use <b>getUser</b> method to get user's information from Facebook.
``` js
import { FacebookAuthService } from 'facebook-auth-nestjs';

@Injectable()
export class AppService {

  constructor(private readonly service: FacebookAuthService) { }
  
  async getFacebookUser(accessToken: string): Promise<{ id: string, name: string }> {
    return await this.service.getUser(accessToken, 'id', 'name');
  }
}
```

- To call <b>getUser</b> method you have to pass the accessToken (sent from front-end login method) and pass the user's fields you want (id, first_name, etc..).
- If you want a field in additional to <i>'id'</i>, <i>'name'</i>, <i>'first_name'</i> or <i>'last_name'</i>, you must set the corresponding scope permission on the front-end login method. Ex: to get birthday field on <b>getUser</b> method, you must add the <i>'user_birthday'</i> scope permission on your front-end login method.


## Facebook References

<ol>
<li><b>Facebook's front-end login:</b> https://developers.facebook.com/docs/reference/javascript/FB.login/v8.0</li>
<li><b>Facebook's scope permissions:</b> https://developers.facebook.com/docs/permissions/reference</li>
<li><b>Facebook's user fields</b> https://developers.facebook.com/docs/graph-api/reference/user</li>
</ol>
