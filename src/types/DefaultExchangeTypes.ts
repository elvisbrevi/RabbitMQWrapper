import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface DefaultMessageOptions extends BaseMessageOptions {
  /**
   * Nombre de la cola en la que se enviará el mensaje.
   */
  queue: string;
}

export interface DefaultConsumeOptions extends BaseConsumeOptions {
  /**
   * Nombre de la cola en la que se consumirá el mensaje.
   */
  queue: string;
}
