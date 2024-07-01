import { ExchangeType } from "./enums/ExchangeType";
import {
  DefaultMessageOptions,
  DefaultConsumeOptions,
  DirectMessageOptions,
  DirectConsumeOptions,
  FanoutMessageOptions,
  FanoutConsumeOptions,
  RabbitMQConfig,
} from "./types";
import { ExchangeFactory } from "./exchanges/ExchangeFactory";

/**
 * Clase principal para interactuar con RabbitMQ.
 * Contiene métodos para enviar y consumir mensajes utilizando diferentes patrones de intercambio.
 * @example
 * const client = new RabbitMQClient({ url: "localhost" });
 * const queue = "default-queue";
 * const message = "Default Message";
 * await client.sendMessage(ExchangeType.DEFAULT, { queue, message });
 */
class RabbitMQClient {
  private exchangeFactory: ExchangeFactory;

  constructor(private config: RabbitMQConfig) {
    this.exchangeFactory = new ExchangeFactory(config);
  }

  /**
   * Envía un mensaje utilizando el patron de intercambio por defecto.
   * El intercambio por defecto es el que se utiliza para enviar mensajes a un solo destinatario.
   * @param {DefaultMessageOptions} options - Objeto con los parámetros necesarios para enviar el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando el mensaje se envía correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la envío del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const queue = "default-queue";
   * const message = "Default Message";
   * await client.sendMessage(ExchangeType.DEFAULT, { queue, message });
   */
  public async sendMessage(
    exchangeType: ExchangeType.DEFAULT,
    options: DefaultMessageOptions
  ): Promise<void>;
  /**
   * Envía un mensaje utilizando el patron de intercambio Direct.
   * El intercambio Direct es el que se utiliza para enviar mensajes a un solo destinatario.
   * @param {DirectMessageOptions} options - Objeto con los parámetros necesarios para enviar el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando el mensaje se envía correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la envío del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const exchange = "direct-exchange";
   * const key = "test-key";
   * const message = "Test Message";
   *
   * await client.sendMessage(ExchangeType.DIRECT, { exchange, key, message });
   */
  public async sendMessage(
    exchangeType: ExchangeType.DIRECT,
    options: DirectMessageOptions
  ): Promise<void>;
  /**
   * Envía un mensaje utilizando el patron de intercambio Fanout.
   * El intercambio Fanout es el que se utiliza para enviar mensajes a varios destinatarios.
   * @param {FanoutMessageOptions} options - Objeto con los parámetros necesarios para enviar el mensaje.
   * @returns {Promise<void>} - Promise que resolve cuando el mensaje se envía correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la envío del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const exchange = "fanout-exchange";
   * const message = "Test Message";
   *
   * await client.sendMessage(ExchangeType.FANOUT, { exchange, message });
   */
  public async sendMessage(
    exchangeType: ExchangeType.FANOUT,
    options: FanoutMessageOptions
  ): Promise<void>;
  public async sendMessage(
    exchangeType: ExchangeType,
    options: DefaultMessageOptions | DirectMessageOptions | FanoutMessageOptions
  ) {
    const exchange = this.exchangeFactory.getExchange(exchangeType);
    await exchange.sendMessage(options);
  }

  /**
   * Consume un mensaje utilizando el patron de intercambio por defecto.
   * @param {DefaultConsumeOptions} options - Objeto con los parámetros necesarios para consumir el mensaje.
   * @returns {Promise<String>} - Promise que resolve cuando se consume el mensaje correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la consumición del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const queue = "default-queue";
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from queue '${queue}'`);
   * }
   * await client.consumeMessage(ExchangeType.DEFAULT, { queue, onMessage });
   */
  public async consumeMessage(
    exchangeType: ExchangeType.DEFAULT,
    options: DefaultConsumeOptions
  ): Promise<String>;
  /**
   * Consume un mensaje utilizando el patron de intercambio Direct.
   * @param {DirectConsumeOptions} options - Objeto con los parámetros necesarios para consumir el mensaje.
   * @returns {Promise<String>} - Promise que resolve cuando se consume el mensaje correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la consumición del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const exchange = "direct-exchange";
   * const key = "test-key";
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from exchange '${exchange}' and routing key '${key}'`);
   * }
   * await client.consumeMessage(ExchangeType.DIRECT, { exchange, key, onMessage });
   */
  public async consumeMessage(
    exchangeType: ExchangeType.DIRECT,
    options: DirectConsumeOptions
  ): Promise<String>;
  /**
   * Consume un mensaje utilizando el patron de intercambio Fanout.
   * @param {FanoutConsumeOptions} options - Objeto con los parámetros necesarios para consumir el mensaje.
   * @returns {Promise<String>} - Promise que resolve cuando se consume el mensaje correctamente.
   * @throws {Error} - Si se produjo un error durante la conexión a RabbitMQ o la consumición del mensaje.
   * @example
   * const client = new RabbitMQClient();
   * const exchange = "fanout-exchange";
   * const onMessage = (msg: string) => {
   *   console.log(`[x] Received '${msg}' from exchange '${exchange}' and routing key '${key}'`);
   * }
   * await client.consumeMessage(ExchangeType.FANOUT, { exchange, onMessage });
   */
  public async consumeMessage(
    exchangeType: ExchangeType.FANOUT,
    options: FanoutConsumeOptions
  ): Promise<String>;

  public async consumeMessage(
    exchangeType: ExchangeType,
    options: DefaultConsumeOptions | DirectConsumeOptions | FanoutConsumeOptions
  ) {
    const exchange = this.exchangeFactory.getExchange(exchangeType);
    return await exchange.consumeMessage(options);
  }
}

export default RabbitMQClient;
