import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface FanoutMessageOptions extends BaseMessageOptions {
  /**
   * Nombre del intercambio en el que se enviará el mensaje.
   */
  exchange: string;
}

export interface FanoutConsumeOptions extends BaseConsumeOptions {
  /**
   * Nombre del intercambio en el que se consumirá el mensaje.
   */
  exchange: string;
}
