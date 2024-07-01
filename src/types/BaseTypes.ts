export interface BaseMessageOptions {
  /**
   * Mensaje que se enviará.
   */
  message: string;
}

export interface BaseConsumeOptions {
  /**
   * Función que se ejecutará cuando se consume el mensaje.
   */
  onMessage: (msg: string) => void;
}
