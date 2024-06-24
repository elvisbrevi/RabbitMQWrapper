import { ExchangeType } from "../src/enums/ExchangeType";
import RabbitMQClient from "../src/RabbitMQClient";

jest.setTimeout(50000);

/**
 * Test del patron de intercambio por defecto.
 */
describe("default exchange", () => {
  it("deberia enviar y recibir un mensaje desde una sola cola por defecto", async () => {
    const client = RabbitMQClient.getInstance(ExchangeType.DEFAULT);
    const queue = "default-queue";

    await client.sendMessage({
      queue,
      message: "Default Message A",
    });
    await client.sendMessage({
      queue,
      message: "Default Message B",
    });

    let receivedMessage = "";
    await new Promise<void>((resolve) => {
      client.consumeMessage({
        queue,
        onMessage: (msg: string) => {
          receivedMessage = msg;
          console.log(`[x] Received '${msg}' from queue '${queue}'`);
          resolve();
        },
      });
    });

    expect(receivedMessage).toContain("Default");
  });
});
