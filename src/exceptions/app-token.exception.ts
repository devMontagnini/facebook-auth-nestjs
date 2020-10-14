import { FacebookException } from "./facebook.exception";

export class AppTokenException extends FacebookException {
  constructor() {
    super('Error on generate app token.');
  }
}