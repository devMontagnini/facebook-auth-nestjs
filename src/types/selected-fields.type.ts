import { UserInfoResponse } from '../responses/user-info.response';
import { Fields } from "./fields.type";

export type SelectedFields<T extends Fields> = {
  [P in T]: UserInfoResponse[P]
}