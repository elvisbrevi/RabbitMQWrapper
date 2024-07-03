const assert = require("assert");
import { ExchangeType } from "../src/enums/ExchangeType";
import RabbitMQClient from "../src/RabbitMQClient";

(async function runTests() {
  console.log("Running tests...");

  // Test del patrón de intercambio por defecto
  async function testDefaultExchange() {
    console.log(
      "🧪 Test: deberia enviar y recibir un mensaje desde una sola cola por defecto"
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
    console.log("👍 Test passed");
  }

  // Test del patrón de intercambio Fanout
  async function testFanoutExchange() {
    console.log(
      "🧪 Test: debería enviar un mensaje y ser recibido por dos consumidores Fanout Exchange"
    );
    const client = new RabbitMQClient({ url: "localhost" });
    const exchange = "fanout-exchange";

    let messageReceivedA = false;
    let messageReceivedB = false;

    // Configura los consumidores antes de enviar el mensaje
    client.consumeMessage(ExchangeType.FANOUT, {
      exchange,
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer A)`
        );
        messageReceivedA = true;
        assert(
          msg.includes("Fanout"),
          `Expected received message to contain "Fanout", but got "${msg}"`
        );
      },
    });

    client.consumeMessage(ExchangeType.FANOUT, {
      exchange,
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer B)`
        );
        messageReceivedB = true;
        assert(
          msg.includes("Fanout"),
          `Expected received message to contain "Fanout", but got "${msg}"`
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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    assert(messageReceivedA, "Consumer A did not receive the message");
    assert(messageReceivedB, "Consumer B did not receive the message");

    console.log("👍 Test passed");
  }

  // Test del patrón de intercambio Direct
  async function testDirectExchange() {
    console.log(
      "🧪 Test: debería enviar un mensaje distinto para cada cola Direct Exchange"
    );
    const client = new RabbitMQClient({ url: "localhost" });
    const exchange = "direct-exchange";

    let messageReceivedA = "";
    let messageReceivedB = "";

    // Configura los consumidores antes de enviar el mensaje
    client.consumeMessage(ExchangeType.DIRECT, {
      exchange,
      key: "key-a",
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer A)`
        );
        messageReceivedA = msg;
      },
    });

    client.consumeMessage(ExchangeType.DIRECT, {
      exchange,
      key: "key-b",
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer B)`
        );
        messageReceivedB = msg;
      },
    });

    // Espera un momento para asegurarte de que los consumidores estén listos
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Envía los mensajes
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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    assert(
      messageReceivedA.includes("Direct Message A"),
      `Expected received message to contain "Direct Message A", but got "${messageReceivedA}"`
    );
    assert(
      messageReceivedB.includes("Direct Message B"),
      `Expected received message to contain "Direct Message B", but got "${messageReceivedB}"`
    );
    console.log("👍 Test passed");
  }

  // Test del patrón de intercambio Headers
  async function testHeadersExchange() {
    console.log(
      "🧪 Test: debería enviar un mensaje distinto para cada cola Headers Exchange"
    );
    const client = new RabbitMQClient({ url: "localhost" });
    const exchange = "headers-exchange";

    let messageReceivedA = false;
    let messageReceivedB = false;

    // Configura los consumidores antes de enviar el mensaje
    client.consumeMessage(ExchangeType.HEADERS, {
      exchange,
      bindings: [
        { recent_purchase: "false" },
        { interested_category: "electronics" },
      ],
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer A)`
        );
        messageReceivedA = true;
        assert(
          msg.includes("Headers Message A"),
          `Expected received message to contain "Headers", but got "${msg}"`
        );
      },
    });

    client.consumeMessage(ExchangeType.HEADERS, {
      exchange,
      bindings: [
        { recent_purchase: "true" },
        { interested_category: "electronics" },
      ],
      onMessage: (msg: string) => {
        console.log(
          `[x] Received '${msg}' from exchange '${exchange}' (Consumer B)`
        );
        messageReceivedB = true;
        assert(
          msg.includes("Headers Message B"),
          `Expected received message to contain "Headers", but got "${msg}"`
        );
      },
    });

    // Espera un momento para asegurarte de que los consumidores estén listos
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const headersA = {
      recent_purchase: "false",
      interested_category: "electronics",
    };
    // Envía el mensaje
    await client.sendMessage(ExchangeType.HEADERS, {
      exchange,
      headers: headersA,
      message: "Headers Message A",
    });

    const headersB = {
      recent_purchase: "true",
      interested_category: "electronics",
    };
    await client.sendMessage(ExchangeType.HEADERS, {
      exchange,
      headers: headersB,
      message: "Headers Message B",
    });

    // Espera a que ambos consumidores reciban el mensaje
    await new Promise((resolve) => setTimeout(resolve, 2000));

    assert(messageReceivedA, "Consumer A did not receive the message");
    assert(messageReceivedB, "Consumer B did not receive the message");

    console.log("👍 Test passed");
  }

  // Ejecuta las pruebas
  try {
    await testDefaultExchange();
    await testFanoutExchange();
    await testDirectExchange();
    await testHeadersExchange();
  } catch (error) {
    console.error("🚩 Test failed:", error);
  }

  console.log("🏁 All tests completed");
})();
