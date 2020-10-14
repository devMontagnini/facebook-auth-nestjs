import { FacebookException } from "./facebook.exception";

export class InvalidUserException extends FacebookException {
  constructor() {
    super('Invalid user\'s token.');
  }
}