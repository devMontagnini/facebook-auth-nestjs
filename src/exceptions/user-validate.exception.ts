import { FacebookAuthException } from "./facebook-auth.exception";

export class UserValidateException extends FacebookAuthException {
  constructor() {
    super('Error validating user.');
  }
}