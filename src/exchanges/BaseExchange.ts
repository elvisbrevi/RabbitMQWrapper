import amqp, { Channel, Connection } from "amqplib";
import { BaseMessageOptions, BaseConsumeOptions } from "../types/BaseTypes";
import { RabbitMQConfig } from "../types";

export abstract class BaseExchange {
  protected connection: Connection | null = null;
  protected channel: Channel | null = null;

  constructor(protected config: RabbitMQConfig) {}

  protected async connect() {
    if (!this.connection) {
      const { url, username, password } = this.config;
      const connectionString =
        username && password
          ? `amqp://${username}:${password}@${url.split("//")[1]}`
          : `amqp://${url}`;
      this.connection = await amqp.connect(connectionString);
      this.channel = await this.connection.createChannel();
    }
  }

  abstract sendMessage(options: BaseMessageOptions): Promise<void>;
  abstract consumeMessage(options: BaseConsumeOptions): Promise<void>;
}
