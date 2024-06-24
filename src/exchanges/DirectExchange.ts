import { RabbitMQExchange } from "./RabbitMQExchange";
import amqp, { Channel, Connection } from "amqplib";
import { MessageOptions, ConsumeOptions } from "../types";

export class DirectExchange implements RabbitMQExchange {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly rabbitMQUrl: string = "amqp://localhost";

  /**
   * Inicia la conexión a RabbitMQ.
   */
  private async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(this.rabbitMQUrl);
      this.channel = await this.connection.createChannel();
    }
  }

  /**
   * Envía un mensaje utilizando el patron de intercambio Direct.
   * El intercambio Direct es el que se utiliza para enviar mensajes a un solo destinatario.
   * @param {MessageOptions} options - Objeto con los parámetros necesarios para enviar el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando el mensaje se envía correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la envío del mensaje.
   * @example
   * const client = RabbitMQClient.getInstance(ExchangeType.DIRECT);
   * const exchange = "test-exchange";
   * const key = "test-key";
   * const message = "Test Message";
   *
   * await client.sendMessage({ exchange, key, message });
   */
  public async sendMessage({
    exchange = "",
    key = "",
    message,
  }: MessageOptions): Promise<void> {
    try {
      await this.connect();
      if (this.channel) {
        await this.channel.assertExchange(exchange, "direct", {
          durable: false,
        });
        this.channel.publish(exchange, key, Buffer.from(message));
        console.log(
          `[x] Sent '${message}' to exchange '${exchange}' and routing key '${key}'`
        );
      } else {
        throw new Error("Error en la conexión a RabbitMQ");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error en la conexión a RabbitMQ");
    }
  }

  /**
   * Consume un mensaje utilizando el patron de intercambio Direct.
   * @param {ConsumeOptions} options - Objeto con los parámetros necesarios para consumir el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando se consume el mensaje correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la consumición del mensaje.
   * @example
   * const client = RabbitMQClient.getInstance(ExchangeType.DIRECT);
   * const exchange = "test-exchange";
   * const key = "test-key";
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from exchange '${exchange}' and routing key '${key}'`);
   *
   * await client.consumeMessage({ exchange, key, onMessage });
   */
  public async consumeMessage({
    exchange = "",
    key = "",
    onMessage,
  }: ConsumeOptions): Promise<void> {
    try {
      await this.connect();
      if (this.channel) {
        await this.channel.assertExchange(exchange, "direct", {
          durable: false,
        });

        let q = await this.channel.assertQueue("", {
          exclusive: true,
        });
        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );
        await this.channel.bindQueue(q.queue, exchange, key);

        await this.channel.consume(
          q.queue,
          (msg) => {
            if (msg !== null) {
              onMessage(msg.content.toString());
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
    return;
  }
}
