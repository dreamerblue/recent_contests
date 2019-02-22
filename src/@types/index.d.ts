declare interface IPlatformUpdateStatus {
  source: string;
  updated_at: string;
}

declare interface IApiResponseStatus {
  GitHub: string;
  message: string;
  contests_link: string;
  updated_at: IPlatformUpdateStatus[];
}

declare interface IContest {
  hash: string;
  id?: string | number;
  source: string;
  name: string;
  description?: string;
  type?: string;
  link: string;
  length?: string;
  authors?: string[];
  start_time: string;
  end_time: string;
  register_start_time?: string;
  register_end_time?: string;
}

declare type ApiResponseContests = IContest[];
