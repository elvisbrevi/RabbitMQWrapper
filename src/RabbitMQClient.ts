import { ExchangeType } from "./enums/ExchangeType";
import { BaseMessageOptions, BaseConsumeOptions } from "./types/BaseTypes";
import { ExchangeFactory } from "./exchanges/ExchangeFactory";

class RabbitMQClient {
  private exchangeFactory: ExchangeFactory;

  constructor() {
    this.exchangeFactory = new ExchangeFactory();
  }

  public async sendMessage<T extends BaseMessageOptions>(
    exchangeType: ExchangeType,
    options: T
  ) {
    const exchange = this.exchangeFactory.getExchange(exchangeType);
    await exchange.sendMessage(options);
  }

  public async consumeMessage<T extends BaseConsumeOptions>(
    exchangeType: ExchangeType,
    options: T
  ) {
    const exchange = this.exchangeFactory.getExchange(exchangeType);
    return await exchange.consumeMessage(options);
  }
}

export default RabbitMQClient;
