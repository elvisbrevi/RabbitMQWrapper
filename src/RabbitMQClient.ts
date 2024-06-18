import amqp, { Channel, Connection } from "amqplib";
import { MessageOptions, ConsumeOptions } from "./types";

/**
 * RabbitMQClient es una clase singleton que permite conectarse a un broker RabbitMQ y enviar y consumir mensajes.
 * La conexión se establece automáticamente cuando se crea la instancia de la clase.
 * Los mensajes se envían y se consumen en el callback de la función consumeMessage.
 * El constructor de la clase es privado, por lo que solo se puede crear una instancia de la clase.
 * La instancia de la clase se almacena en la variable instance de la clase.
 */
class RabbitMQClient {
  /**
   * La instancia de la clase singleton de RabbitMQClient.
   */
  private static instance: RabbitMQClient;
  /**
   * La conexión a RabbitMQ. Se establece automáticamente cuando se crea la instancia de la clase.
   * Se establece en null por defecto, y se establece automáticamente cuando se crea la instancia de la clase.
   */
  private connection: Connection | null = null;
  /**
   * El canal de RabbitMQ. Se establece automáticamente cuando se crea la instancia de la clase.
   * El canal se utiliza para enviar y consumir mensajes.
   * Se establece en null por defecto, y se establece automáticamente cuando se crea la instancia de la clase.
   */
  private channel: Channel | null = null;
  /**
   * La URL de la conexión a RabbitMQ. Se establece automáticamente cuando se crea la instancia de la clase.
   */
  private readonly rabbitMQUrl: string = "amqp://localhost";

  /**
   * Constructor de la clase RabbitMQClient.
   */
  private constructor() {}

  /**
   * Obtiene la instancia de la clase RabbitMQClient.
   */
  public static getInstance(): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient();
    }
    return RabbitMQClient.instance;
  }

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
   * Envía un mensaje utilizando el patron de intercambio por defecto.
   * El intercambio por defecto es el que se utiliza para enviar mensajes a un solo destinatario.
   * @param {MessageOptions} options - Objeto con los parámetros necesarios para enviar el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando el mensaje se envía correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la envío del mensaje.
   * @example
   * const client = RabbitMQClient.getInstance();
   * const queue = "test-queue";
   * const message = "Test Message";
   *
   * await client.sendMessageToDefaultExchange({ queue, message });
   */
  public async sendMessageToDefaultExchange({
    queue,
    message,
  }: MessageOptions) {
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
   * const client = RabbitMQClient.getInstance();
   * const queue = "test-queue";
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from queue '${queue}'`);
   * };
   *
   * await client.consumeMessageFromDefaultExchange({ queue, onMessage });
   */
  public async consumeMessageFromDefaultExchange({
    queue,
    onMessage,
  }: ConsumeOptions) {
    try {
      await this.connect();
      if (this.channel) {
        await this.channel.assertQueue(queue, { durable: false });
        console.log(
          `[*] Waiting for messages in '${queue}'. To exit press CTRL+C`
        );

        this.channel.consume(queue, (msg) => {
          if (msg !== null) {
            onMessage(msg.content.toString());
            this.channel?.ack(msg);
          }
        });
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

/**
 * Exporta la clase RabbitMQClient.
 */
export default RabbitMQClient;
