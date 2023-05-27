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

        counts += 1;
      },
    });

    dispatchJob(mockJob);
    dispatchJob(mockJob);

    expect(counts).toBe(2);
  });

  it("Should double dispatch jobs that should be at most once", () => {
    let counts = 0;

    const mockJob: Job = {
      qos: QOSLevels.AtMostOnce,
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

        counts += 1;
      },
    });

    dispatchJob(mockJob);
    dispatchJob(mockJob);

    expect(counts).toBe(2);
  });
});
