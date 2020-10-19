import { FacebookAuthException } from "./facebook-auth.exception";

export class GetUserFieldsException extends FacebookAuthException {
  constructor() {
    super('Error getting user\'s fields.');
  }
}