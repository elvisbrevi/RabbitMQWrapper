import { RabbitMQExchange } from "./exchanges/RabbitMQExchange";
import { DefaultExchange } from "./exchanges/DefaultExchange";
import { FanoutExchange } from "./exchanges/FanoutExchange";
import { DirectExchange } from "./exchanges/DirectExchange";
// import { TopicExchange } from "./exchange/TopicExchange";
// import { HeadersExchange } from "./exchange/HeadersExchange";
// import { RPCExchange } from "./exchange/RPCExchange";
import { ExchangeType } from "./enums/ExchangeType";
import { MessageOptions, ConsumeOptions } from "./types";

class RabbitMQClient {
  private static instance: RabbitMQClient | null = null;
  private exchange: RabbitMQExchange;

  private constructor(exchange: RabbitMQExchange) {
    this.exchange = exchange;
  }

  public static getInstance(exchangeType: ExchangeType): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient(
        this.getExchangeType(exchangeType)
      );
    }
    return RabbitMQClient.instance;
  }

  private static getExchangeType(exchangeType: ExchangeType): RabbitMQExchange {
    switch (exchangeType) {
      case ExchangeType.FANOUT:
        return new FanoutExchange();
      case ExchangeType.DIRECT:
        return new DirectExchange();
      // case ExchangeType.TOPIC:
      //   return new TopicExchange();
      // case ExchangeType.HEADERS:
      //   return new HeadersExchange();
      // case ExchangeType.RPC:
      //   return new RPCExchange();
      case ExchangeType.DEFAULT:
      default:
        return new DefaultExchange();
    }
  }

  public setExchangeType(exchangeType: ExchangeType) {
    this.exchange = RabbitMQClient.getExchangeType(exchangeType);
  }

  public async sendMessage(options: MessageOptions) {
    await this.exchange.sendMessage(options);
  }

  public async consumeMessage(options: ConsumeOptions) {
    await this.exchange.consumeMessage(options);
  }
}

export default RabbitMQClient;
