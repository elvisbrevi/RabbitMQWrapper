import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface DirectMessageOptions extends BaseMessageOptions {
  /**
   * Nombre del intercambio en el que se enviará el mensaje.
   */
  exchange: string;
  /**
   * Routing key del mensaje.
   */
  key: string;
}

export interface DirectConsumeOptions extends BaseConsumeOptions {
  /**
   * Nombre del intercambio en el que se consumirá el mensaje.
   */
  exchange: string;
  /**
   * Routing key del mensaje.
   */
  key: string;
}
