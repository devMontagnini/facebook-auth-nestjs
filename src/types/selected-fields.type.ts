import { UserFieldsResponse } from '../responses/user-fields.response';
import { Fields } from "./fields.type";

export type SelectedFields<T extends Fields> = {
  [P in T]: UserFieldsResponse[P]
}