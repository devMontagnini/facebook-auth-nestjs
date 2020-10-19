export interface UserFieldsResponse {
  id: string;
  name: string;
  about: string;
  email: string;
  quotes: string;
  gender: string;
  website: string;
  religion: string;
  birthday: string;
  username: string;
  short_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  name_format: string;
  profile_pic: string;
  meeting_for: Array<string>;
  published_timeline: boolean;
  relationship_status: string;
  interested_in: Array<string>;
  messenger_join_notifications_enabled: boolean;
}