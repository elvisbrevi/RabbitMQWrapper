import RabbitMQClient from "../src/RabbitMQClient";

describe("RabbitMQClient", () => {
  it("should send and consume a message", async () => {
    const client = RabbitMQClient.getInstance();
    const queue = "test-queue";
    const message = "Test Message";

    await client.sendMessage({ queue, message });

    let receivedMessage = "";
    await new Promise<void>((resolve) => {
      client.consumeMessage({
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
