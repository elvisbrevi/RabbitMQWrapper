import { ExchangeType } from "./enums/ExchangeType";
import { MessageOptions, ConsumeOptions } from "./types";
import { ExchangeFactory } from "./exchanges/ExchangeFactory";

class RabbitMQClient {
  private exchangeFactory: ExchangeFactory;

  constructor() {
    this.exchangeFactory = new ExchangeFactory();
  }

  public async sendMessage(
    exchangeType: ExchangeType,
    options: MessageOptions
  ) {
    const exchange = this.exchangeFactory.getExchange(exchangeType);
    await exchange.sendMessage(options);
  }

  public async consumeMessage(
    exchangeType: ExchangeType,
    options: ConsumeOptions
  ) {
    const exchange = this.exchangeFactory.getExchange(exchangeType);
    return await exchange.consumeMessage(options);
  }
}

export default RabbitMQClient;
