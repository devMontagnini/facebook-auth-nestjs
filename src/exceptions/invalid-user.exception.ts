import { FacebookAuthException } from "./facebook-auth.exception";

export class InvalidUserException extends FacebookAuthException {
  constructor() {
    super('Invalid user\'s token.');
  }
}