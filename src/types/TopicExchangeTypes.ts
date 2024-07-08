import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface TopicMessageOptions extends BaseMessageOptions {
  /**
   * Nombre del intercambio en el que se enviará el mensaje.
   */
  exchange: string;
  /**
   * Routing key del mensaje.
   */
  key: string;
}

export interface TopicConsumeOptions extends BaseConsumeOptions {
  /**
   * Nombre del intercambio en el que se consumirá el mensaje.
   */
  exchange: string;
  /**
   * Lista de routing keys del mensaje.
   * Las claves de enlace se utilizan para identificar el mensaje en el intercambio.
   * Ejemplo de una clave de enlace: {
      'shoes.expensive.red',
      'coat.cheap.blue',
      'coat.expensive.orange',
      'shoes.cheap.red'
    }
   */
  keys: string[];
}
