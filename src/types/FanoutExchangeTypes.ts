import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface FanoutMessageOptions extends BaseMessageOptions {
  exchange: string;
}

export interface FanoutConsumeOptions extends BaseConsumeOptions {
  exchange: string;
}
