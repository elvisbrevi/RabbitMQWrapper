/**
 * Interfaz para los parámetros necesarios para enviar un mensaje.
 */
export interface MessageOptions {
  /**
   * La cola a la que se enviará el mensaje.
   */
  queue: string;
  /**
   * El mensaje a enviar.
   */
  message: string;
}

/**
 * Interfaz para los parámetros necesarios para consumir un mensaje.
 */
export interface ConsumeOptions {
  /**
   * La cola de la que se consumirá el mensaje.
   */
  queue: string;
  /**
   * El callback que se ejecutará cuando se reciba un mensaje.
   */
  onMessage: (msg: string) => void;
}
