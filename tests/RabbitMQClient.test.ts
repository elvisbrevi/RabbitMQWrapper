import RabbitMQClient from "../src/RabbitMQClient";

jest.setTimeout(10000);

/**
 * Test del patron de intercambio por defecto.
 */
describe("default exchange", () => {
  it("deberia enviar y recibir un mensaje desde una sola cola por defecto", async () => {
    const client = RabbitMQClient.getInstance();
    const queue = "test-queue";

    await client.sendMessageToDefaultExchange({
      queue,
      message: "Default Message A",
    });
    await client.sendMessageToDefaultExchange({
      queue,
      message: "Default Message B",
    });

    let receivedMessage = "";
    await new Promise<void>((resolve) => {
      client.consumeMessageFromDefaultExchange({
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
