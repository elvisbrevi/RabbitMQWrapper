import RabbitMQClient from "../src/RabbitMQClient";

/**
 * Test del patron de intercambio por defecto.
 */
describe("default exchange", () => {
  it("deberia enviar y recibir un mensaje desde una sola cola por defecto", async () => {
    const client = RabbitMQClient.getInstance();
    const queue = "test-queue";
    const message = "Test Message";

    await client.sendMessageToDefaultExchange({ queue, message });

    let receivedMessage = "";
    await new Promise<void>((resolve) => {
      client.consumeMessageFromDefaultExchange({
        queue,
        onMessage: (msg: string) => {
          receivedMessage = msg;
          resolve();
        },
      });
    });

    expect(receivedMessage).toBe(message);
  });
});
