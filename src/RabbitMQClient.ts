import amqp, { Channel, Connection } from "amqplib";
import { MessageOptions, ConsumeOptions } from "./types";

class RabbitMQClient {
  private static instance: RabbitMQClient;
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly rabbitMQUrl: string = "amqp://localhost";

  private constructor() {}

  public static getInstance(): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient();
    }
    return RabbitMQClient.instance;
  }

  private async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(this.rabbitMQUrl);
      this.channel = await this.connection.createChannel();
    }
  }

  public async sendMessage({ queue, message }: MessageOptions) {
    await this.connect();
    if (this.channel) {
      await this.channel.assertQueue(queue, { durable: false });
      this.channel.sendToQueue(queue, Buffer.from(message));
      console.log(`[x] Sent '${message}' to queue '${queue}'`);
    }
  }

  public async consumeMessage({ queue, onMessage }: ConsumeOptions) {
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
    }
  }
}

export default RabbitMQClient;
