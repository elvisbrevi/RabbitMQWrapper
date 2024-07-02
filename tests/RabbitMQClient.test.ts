const assert = require("assert");
import { ExchangeType } from "../src/enums/ExchangeType";
import RabbitMQClient from "../src/RabbitMQClient";

(async function runTests() {
  console.log("Running tests...");

  // Test del patrón de intercambio por defecto
  async function testDefaultExchange() {
    console.log(
      "Test: deberia enviar y recibir un mensaje desde una sola cola por defecto"
    );
    const client = new RabbitMQClient({ url: "localhost" });
    const queue = "default-queue";

    await client.sendMessage(ExchangeType.DEFAULT, {
      queue: queue,
      message: "Default Message A",
    });
    await client.sendMessage(ExchangeType.DEFAULT, {
      queue,
      message: "Default Message B",
    });

    let receivedMessage = "";
    await client.consumeMessage(ExchangeType.DEFAULT, {
      queue,
      onMessage: (msg: string) => {
        receivedMessage = msg;
        console.log(`[x] Received '${msg}' from queue '${queue}'`);
      },
    });

    assert(
      receivedMessage.includes("Default"),
      `Expected received message to contain "Default", but got "${receivedMessage}"`
    );
    console.log("Test passed");
  }

  // Test del patrón de intercambio Fanout
  async function testFanoutExchange() {
    console.log(
      "Test: deberia enviar un mensaje y ser recibido por dos consumidores Fanout Exchange"
    );
    const client = new RabbitMQClient({ url: "localhost" });
    const exchange = "fanout-exchange";

    // Configura los consumidores antes de enviar el mensaje
    const consumePromiseA = client.consumeMessage(ExchangeType.FANOUT, {
      exchange,
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer A)`
        );
      },
    });

    const consumePromiseB = client.consumeMessage(ExchangeType.FANOUT, {
      exchange,
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer B)`
        );
      },
    });

    // Espera un momento para asegurarte de que los consumidores estén listos
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Envía el mensaje
    await client.sendMessage(ExchangeType.FANOUT, {
      exchange,
      message: "Fanout Message",
    });

    // Espera a que ambos consumidores reciban el mensaje
    const [receivedMessageA, receivedMessageB] = await Promise.all([
      consumePromiseA,
      consumePromiseB,
    ]);

    assert(
      receivedMessageA.includes("Fanout"),
      `Expected received message to contain "Fanout", but got "${receivedMessageA}"`
    );
    assert(
      receivedMessageB.includes("Fanout"),
      `Expected received message to contain "Fanout", but got "${receivedMessageB}"`
    );
    console.log("Test passed");
  }

  // Test del patrón de intercambio Direct
  async function testDirectExchange() {
    console.log(
      "Test: deberia enviar un mensaje distinto para cada cola Direct Exchange"
    );
    const client = new RabbitMQClient({ url: "localhost" });
    const exchange = "direct-exchange";

    // Configura los consumidores antes de enviar el mensaje
    const consumePromiseA = client.consumeMessage(ExchangeType.DIRECT, {
      exchange,
      key: "key-a",
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer A)`
        );
      },
    });

    const consumePromiseB = client.consumeMessage(ExchangeType.DIRECT, {
      exchange,
      key: "key-b",
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer B)`
        );
      },
    });

    // Espera un momento para asegurarte de que los consumidores estén listos
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Envía el mensaje
    await client.sendMessage(ExchangeType.DIRECT, {
      exchange,
      key: "key-a",
      message: "Direct Message A",
    });

    await client.sendMessage(ExchangeType.DIRECT, {
      exchange,
      key: "key-b",
      message: "Direct Message B",
    });

    // Espera a que ambos consumidores reciban el mensaje
    const [receivedMessageA, receivedMessageB] = await Promise.all([
      consumePromiseA,
      consumePromiseB,
    ]);

    assert(
      receivedMessageA.includes("Direct Message A"),
      `Expected received message to contain "Direct", but got "${receivedMessageA}"`
    );
    assert(
      receivedMessageB.includes("Direct Message B"),
      `Expected received message to contain "Direct", but got "${receivedMessageB}"`
    );
    console.log("Test passed");
  }

  // Ejecuta las pruebas
  try {
    await testDefaultExchange();
    await testFanoutExchange();
    await testDirectExchange();
  } catch (error) {
    console.error("Test failed:", error);
  }

  console.log("All tests completed");
})();
