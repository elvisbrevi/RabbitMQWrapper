import { MessageOptions, ConsumeOptions } from "../types";

export interface RabbitMQExchange {
  sendMessage(options: MessageOptions): Promise<void>;
  consumeMessage(options: ConsumeOptions): Promise<void>;
}
