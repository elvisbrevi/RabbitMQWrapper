import { BaseExchange } from "./BaseExchange";
import { MessageOptions, ConsumeOptions } from "../types";

export class DefaultExchange extends BaseExchange {
  /**
   * Envía un mensaje utilizando el patron de intercambio por defecto.
   * El intercambio por defecto es el que se utiliza para enviar mensajes a un solo destinatario.
   * @param {MessageOptions} options - Objeto con los parámetros necesarios para enviar el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando el mensaje se envía correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la envío del mensaje.
   * @example
   * const client = RabbitMQClient.getInstance(ExchangeType.DEFAULT);
   * const queue = "test-queue";
   * const message = "Test Message";
   *
   * await client.sendMessage({ queue, message });
   */
  public async sendMessage({
    queue = "",
    message,
  }: MessageOptions): Promise<void> {
    try {
      await this.connect();
      if (this.channel) {
        await this.channel.assertQueue(queue, { durable: false });
        this.channel.sendToQueue(queue, Buffer.from(message));
        console.log(`[x] Sent '${message}' to queue '${queue}'`);
      } else {
        throw new Error("Error en la conexión a RabbitMQ");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error en la conexión a RabbitMQ");
    }
  }

  /**
   * Consume un mensaje utilizando el patron de intercambio por defecto.
   * @param {ConsumeOptions} options - Objeto con los parámetros necesarios para consumir el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando se consume el mensaje correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la consumición del mensaje.
   * @example
   * const client = RabbitMQClient.getInstance(ExchangeType.DEFAULT);
   * const queue = "test-queue";
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from queue '${queue}'`);
   * };
   *
   * await client.consumeMessage({ queue, onMessage });
   */
  public async consumeMessage({
    queue = "",
    onMessage,
  }: ConsumeOptions): Promise<String> {
    try {
      await this.connect();
      if (this.channel) {
        await this.channel.assertQueue(queue, { durable: false });
        console.log(
          `[*] Waiting for messages in '${queue}'. To exit press CTRL+C`
        );

        return new Promise((resolve) => {
          this.channel!.consume(
            queue,
            (msg) => {
              if (msg !== null) {
                const message = msg.content.toString();
                onMessage(message);
                this.channel!.cancel(msg.fields.consumerTag);
                resolve(message);
              }
            },
            { noAck: true }
          );
        });
      } else {
        throw new Error("Error en la conexión a RabbitMQ");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error en la conexión a RabbitMQ");
    }
  }
}
