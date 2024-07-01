import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface DefaultMessageOptions extends BaseMessageOptions {
  queue: string;
}

export interface DefaultConsumeOptions extends BaseConsumeOptions {
  queue: string;
}
