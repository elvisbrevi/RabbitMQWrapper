import amqp, { Channel, Connection } from "amqplib";
import { MessageOptions, ConsumeOptions } from "../types";

export abstract class BaseExchange {
  protected connection: Connection | null = null;
  protected channel: Channel | null = null;
  protected readonly rabbitMQUrl: string = "amqp://localhost";

  protected async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(this.rabbitMQUrl);
      this.channel = await this.connection.createChannel();
    }
  }

  abstract sendMessage(options: MessageOptions): Promise<void>;
  abstract consumeMessage(options: ConsumeOptions): Promise<String>;
}
