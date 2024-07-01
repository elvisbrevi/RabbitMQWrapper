import { ExchangeType } from "../enums/ExchangeType";
import { RabbitMQConfig } from "../types";
import { BaseExchange } from "./BaseExchange";
import { DefaultExchange } from "./DefaultExchange";
import { FanoutExchange } from "./FanoutExchange";
import { DirectExchange } from "./DirectExchange";

export class ExchangeFactory {
  private exchanges: Map<ExchangeType, BaseExchange> = new Map();

  constructor(private config: RabbitMQConfig) {}

  public getExchange(exchangeType: ExchangeType): BaseExchange {
    if (!this.exchanges.has(exchangeType)) {
      this.exchanges.set(exchangeType, this.createExchange(exchangeType));
    }
    return this.exchanges.get(exchangeType)!;
  }

  private createExchange(exchangeType: ExchangeType): BaseExchange {
    switch (exchangeType) {
      case ExchangeType.DEFAULT:
        return new DefaultExchange(this.config);
      case ExchangeType.DIRECT:
        return new DirectExchange(this.config);
      case ExchangeType.FANOUT:
        return new FanoutExchange(this.config);
      // Añadir más casos para otros tipos de exchanges
      default:
        throw new Error(`Exchange type ${exchangeType} not supported`);
    }
  }
}
