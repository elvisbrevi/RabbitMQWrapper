import { BaseExchange } from "./BaseExchange";
import {
  HeadersMessageOptions,
  HeadersConsumeOptions,
} from "../types/HeadersExchangeTypes";

export class HeadersExchange extends BaseExchange {
  /**
   * Envía un mensaje utilizando el patron de intercambio Headers.
   * El intercambio Headers es el que se utiliza para enviar mensajes con información adicional.
   * @param {HeadersMessageOptions} options - Objeto con los parámetros necesarios para enviar el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando el mensaje se envía correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la envío del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const exchange = "headers-exchange";
   * const headers = {
   *   'recent_purchase': 'true',
   *   'interested_category': 'electronics'
   * }
   * const message = "Test Message";
   *
   * await client.sendMessage(ExchangeType.HEADERS, { exchange, headers, message });
   */
  public async sendMessage({
    exchange,
    headers,
    message,
  }: HeadersMessageOptions): Promise<void> {
    try {
      await this.connect();
      if (this.channel) {
        await this.channel.assertExchange(exchange, "headers", {
          durable: false,
        });
        this.channel.publish(exchange, "", Buffer.from(message), {
          headers: headers,
        });
        console.log(`[x] Sent '${message}' to exchange '${exchange}'`);
      } else {
        throw new Error("Error en la conexión a RabbitMQ");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error en la conexión a RabbitMQ");
    }
  }

  /**
   * Consume un mensaje utilizando el patron de intercambio Headers.
   * @param {HeadersConsumeOptions} options - Objeto con los parámetros necesarios para consumir el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando se consume el mensaje correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la consumición del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const exchange = "headers-exchange";
   * const bindings = [
   *   {
   *     'recent_purchase': 'true',
   *     'interested_category': 'electronics'
   *   }
   * ];
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from exchange '${exchange}' and routing key '${key}'`);
   * }
   * await client.consumeMessage(ExchangeType.HEADERS, { exchange, bindings, onMessage });
   */
  public async consumeMessage({
    exchange = "",
    bindings,
    onMessage,
  }: HeadersConsumeOptions): Promise<void> {
    try {
      await this.connect();
      if (this.channel) {
        await this.channel.assertExchange(exchange, "headers", {
          durable: false,
        });

        let q = await this.channel.assertQueue("", {
          exclusive: true,
        });
        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );
        await this.channel.bindQueue(q.queue, exchange, "", ...bindings);

        await this.channel.consume(
          q.queue,
          (msg) => {
            if (msg !== null) {
              const message = msg.content.toString();
              onMessage(message);
            }
          },
          { noAck: true }
        );
      } else {
        throw new Error("Error en la conexión a RabbitMQ");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error en la conexión a RabbitMQ");
    }
  }
}
