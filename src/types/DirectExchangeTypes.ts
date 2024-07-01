import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface DirectMessageOptions extends BaseMessageOptions {
  exchange: string;
  key: string;
}

export interface DirectConsumeOptions extends BaseConsumeOptions {
  exchange: string;
  key: string;
}
