import "fake-indexeddb/auto";
import { Job, QOSLevels } from "./job";
import { registerConsumer } from "./registry";
import { dispatchJob } from "./dispatcher";

describe("Dispatcher", () => {
  it("Should dispatch to a handler", () => {
    const mockJob: Job = {
      qos: QOSLevels.AtLeastOnce,
      topic: "jest-topic",
      data: {
        test: "testData",
      },
    };

    registerConsumer({
      topic: "jest-topic",
      handler: (data) => {
        expect(typeof data).toBe("object");
        expect(data?.test).toBe("testData");
      },
    });

    dispatchJob(mockJob);
  });

  it("Should not double dispatch jobs that should be exactly once", () => {
    let counts = 0;

    const mockJob: Job = {
      qos: QOSLevels.ExactlyOnce,
      topic: "jest-topic-exactly-once",
      data: {
        test: "testData",
      },
    };

    registerConsumer({
      topic: "jest-topic-exactly-once",
      handler: (data) => {
        expect(typeof data).toBe("object");
        expect(data?.test).toBe("testData");

        counts += 1;
      },
    });

    dispatchJob(mockJob);
    dispatchJob(mockJob);

    expect(counts).toBe(1);
  });

  it("Should double dispatch jobs that should be at least once", () => {
    let counts = 0;

    const mockJob: Job = {
      qos: QOSLevels.AtLeastOnce,
      topic: "jest-topic-at-least-once",
      data: {
        test: "testData",
      },
    };

    dispatchJob(mockJob);

    registerConsumer({
      topic: "jest-topic-at-least-once",
      handler: (data) => {
        expect(typeof data).toBe("object");
        expect(data?.test).toBe("testData");

        counts += 1;
      },
    });

    dispatchJob(mockJob);

    expect(counts).toBe(2);
  });

  it("Should double dispatch jobs that should be at most once", () => {
    let counts = 0;

    const mockJob: Job = {
      qos: QOSLevels.AtMostOnce,
      topic: "jest-topic-at-most-once",
      data: {
        test: "testData",
      },
    };

    registerConsumer({
      topic: "jest-topic-at-most-once",
      handler: (data) => {
        expect(typeof data).toBe("object");
        expect(data?.test).toBe("testData");

        counts += 1;
      },
    });

    dispatchJob(mockJob);
    dispatchJob(mockJob);

    expect(counts).toBe(2);
  });

  it("Should receive all of the jobs provided theres the right QoS", () => {
    let counts = 0;

    const mockAtLeastOnceJob: Job = {
      qos: QOSLevels.AtLeastOnce,
      topic: "jest-topic-mixed",
      data: {
        test: "testData",
      },
    };

    const mockAtMostOnceJob: Job = {
      qos: QOSLevels.AtMostOnce,
      topic: "jest-topic-mixed",
      data: {
        test: "testData",
      },
    };

    const mockExactlyOnceJob: Job = {
      qos: QOSLevels.ExactlyOnce,
      topic: "jest-topic-mixed",
      data: {
        test: "testData",
      },
    };

    dispatchJob(mockAtLeastOnceJob);
    dispatchJob(mockExactlyOnceJob);

    registerConsumer({
      topic: "jest-topic-mixed",
      handler: (data) => {
        expect(typeof data).toBe("object");
        expect(data?.test).toBe("testData");

        counts += 1;
      },
    });

    dispatchJob(mockAtLeastOnceJob);
    dispatchJob(mockAtMostOnceJob);
    dispatchJob(mockAtMostOnceJob);
    dispatchJob(mockAtMostOnceJob);

    expect(counts).toBe(6);
  });
});
