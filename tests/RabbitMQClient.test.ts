const assert = require("assert");
import { ExchangeType } from "../src/enums/ExchangeType";
import RabbitMQClient from "../src/RabbitMQClient";

// Configuración del tiempo de espera para la prueba
const TEST_TIMEOUT = 50000;

(async function runTests() {
  console.log("Running tests...");

  // Test del patrón de intercambio por defecto
  async function testDefaultExchange() {
    console.log(
      "Test: deberia enviar y recibir un mensaje desde una sola cola por defecto"
    );
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
    await new Promise((resolve, reject) => {
      client.consumeMessage({
        queue,
        onMessage: (msg: string) => {
          receivedMessage = msg;
          console.log(`[x] Received '${msg}' from queue '${queue}'`);
          resolve(void 0);
        },
      });
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
      "Test: deberia enviar y recibir un mensaje desde una sola cola por defecto"
    );
    const client = RabbitMQClient.getInstance(ExchangeType.FANOUT);
    const exchange = "fanout-exchange";

    await client.sendMessage({
      exchange,
      message: "Fanout Message A",
    });
    await client.sendMessage({
      exchange,
      message: "Fanout Message B",
    });

    let receivedMessage = "";
    await new Promise((resolve, reject) => {
      client.consumeMessage({
        exchange,
        onMessage: (msg: string) => {
          receivedMessage = msg;
          console.log(`[x] Received '${msg}' from exchange '${exchange}'`);
          resolve(void 0);
        },
      });
    });

    assert(
      receivedMessage.includes("Fanout"),
      `Expected received message to contain "Fanout", but got "${receivedMessage}"`
    );
    console.log("Test passed");
  }

  // Ejecuta las pruebas
  try {
    await testDefaultExchange();
    await testFanoutExchange();
  } catch (error) {
    console.error("Test failed:", error);
  }

  console.log("All tests completed");
})();
