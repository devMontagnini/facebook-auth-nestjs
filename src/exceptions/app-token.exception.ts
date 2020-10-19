import { FacebookAuthException } from "./facebook-auth.exception";

export class AppTokenException extends FacebookAuthException {
  constructor() {
    super('Error on generate app token.');
  }
}