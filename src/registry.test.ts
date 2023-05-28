import "fake-indexeddb/auto";
import { QOSLevels } from "./job";
import {
  getConsumerRegistry,
  getJobRegistry,
  registerConsumer,
  registerJob,
} from "./registry";

describe("Registry Creation", () => {
  it("Should create registry maps", () => {
    const atMostOne = getJobRegistry(QOSLevels.AtMostOnce);

    expect(atMostOne instanceof Map).toBe(true);

    const atLeastOnce = getJobRegistry(QOSLevels.AtLeastOnce);

    expect(atLeastOnce instanceof Map).toBe(true);

    const exactlyOnce = getJobRegistry(QOSLevels.ExactlyOnce);

    expect(exactlyOnce instanceof Map).toBe(true);
  });

  it("Should create consumer map", () => {
    const consumers = getConsumerRegistry();

    expect(consumers instanceof Map).toBe(true);
  });

  it("Should register a consumer", () => {
    const registry = getConsumerRegistry();

    registerConsumer({
      topic: "jest-topic",
      handler: () => undefined,
    });

    expect(registry.get("jest-topic")?.length).toBe(1);

    registerConsumer({
      topic: "jest-topic",
      handler: () => undefined,
    });

    expect(registry.get("jest-topic")?.length).toBe(2);

    registerConsumer({
      topic: "jest-topic",
      handler: () => undefined,
    });

    expect(registry.get("jest-topic")?.length).toBe(3);
  });

  it("Should register a job", () => {
    const registry = getJobRegistry(QOSLevels.AtLeastOnce);

    registerJob({
      topic: "jest-topic",
      qos: QOSLevels.AtLeastOnce,
    });

    expect(registry.get("jest-topic")?.length).toBe(1);

    registerJob({
      topic: "jest-topic",
      qos: QOSLevels.AtLeastOnce,
    });

    expect(registry.get("jest-topic")?.length).toBe(2);

    registerJob({
      topic: "jest-topic",
      qos: QOSLevels.AtLeastOnce,
    });

    expect(registry.get("jest-topic")?.length).toBe(3);
  });
});
