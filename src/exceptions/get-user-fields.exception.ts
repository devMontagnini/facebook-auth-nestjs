import { FacebookException } from "./facebook.exception";

export class GetUserFieldsException extends FacebookException {
  constructor() {
    super('Error getting user\'s fields.');
  }
}