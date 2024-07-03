import { BaseMessageOptions, BaseConsumeOptions } from "./BaseTypes";

export interface HeadersMessageOptions extends BaseMessageOptions {
  /**
   * Nombre del intercambio en el que se enviará el mensaje.
   */
  exchange: string;

  /**
   * Headers del mensaje.
   * Los headers se pueden utilizar para agregar información adicional al mensaje.
   * Ejemplo de la estructura de un header: {
   *   'recent_purchase': 'true',
   *   'interested_category': 'electronics'
   * }
   */
  headers: Record<string, string>;
}

export interface HeadersConsumeOptions extends BaseConsumeOptions {
  /**
   * Nombre del intercambio en el que se consumirá el mensaje.
   */
  exchange: string;

  /**
   * Claves de enlace del mensaje.
   * Las claves de enlace se utilizan para identificar el mensaje en el intercambio.
   * Ejemplo de una clave de enlace: {
      'recent_purchase': 'true',
      'interested_category': 'electronics'
    }
   */
  bindings: Record<string, string>[];
}
