export interface BaseMessageOptions {
  /**
   * Mensaje que se enviará.
   */
  message: string;
}

export interface BaseConsumeOptions {
  /**
   * Función que se ejecutará cuando se consume el mensaje.
   * La función recibe como parámetro el mensaje que se ha consumido.
   * @param {string} msg - Mensaje que se ha consumido.
   * @example
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from queue '${queue}'`);
   * }
   */
  onMessage: (msg: string) => void;
}
