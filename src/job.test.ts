import { isJob, isJobCollection, isJobData, Job, QOSLevels } from "./job";

describe("isJob Guard", () => {
  it("Should block invalid jobs", () => {
    const mockData = {};

    expect(isJob(mockData)).toBe(false);
  });

  it("Should block an undefined job", () => {
    expect(isJob(undefined)).toBe(false);
  });

  it("Should block a non-object job", () => {
    expect(isJob(123)).toBe(false);
  });

  it("Should reject invalid job with no QOS", () => {
    const mockData = {
      isDurable: 0,
      topic: "jest",
      data: {
        key: "value",
      },
    };

    expect(isJob(mockData)).toBe(false);
  });

  it("Should reject invalid job durability", () => {
    const mockData = {
      isDurable: "",
      topic: "jest",
      qos: QOSLevels.AtLeastOnce,
      data: {
        key: "value",
      },
    };

    expect(isJob(mockData)).toBe(false);
  });

  it("Should reject invalid job topic", () => {
    const mockData = {
      isDurable: 0,
      topic: false,
      qos: QOSLevels.AtLeastOnce,
      data: {
        key: "value",
      },
    };

    expect(isJob(mockData)).toBe(false);
  });

  it("Should reject invalid job qos", () => {
    const mockData = {
      isDurable: 0,
      topic: "jest",
      qos: 20,
      data: {
        key: "value",
      },
    };

    expect(isJob(mockData)).toBe(false);
  });

  it("Should reject invalid job data", () => {
    const mockData = {
      isDurable: 0,
      topic: "jest",
      qos: QOSLevels.AtLeastOnce,
      data: false,
    };

    expect(isJob(mockData)).toBe(false);
  });

  it("Should accept a valid job", () => {
    const mockData: Job = {
      isDurable: 0,
      topic: "jest",
      qos: QOSLevels.AtLeastOnce,
      data: {
        key: "value",
      },
    };

    expect(isJob(mockData)).toBe(true);
  });
});

describe("isJobCollection Guard", () => {
  it("Should block an invalid job set", () => {
    const mockData = [{}];

    expect(isJobCollection(mockData)).toBe(false);
  });

  it("Should reject non-arrays", () => {
    expect(isJobCollection({})).toBe(false);
  });

  it("Should accept a valid job set", () => {
    const mockData: Job[] = [
      {
        isDurable: 0,
        topic: "jest",
        qos: QOSLevels.AtLeastOnce,
        data: {
          key: "value",
        },
      },
    ];

    expect(isJobCollection(mockData)).toBe(true);
  });
});

describe("isJobData Guard", () => {
  it("Should reject false as data", () => {
    const mockData = false;

    expect(isJobData(mockData)).toBe(false);
  });

  it("Should reject true as data", () => {
    const mockData = true;

    expect(isJobData(mockData)).toBe(false);
  });

  it("Should reject arrays as data", () => {
    const mockData = [];

    expect(isJobData(mockData)).toBe(false);
  });

  it("Should accept undefined job data", () => {
    expect(isJobData(undefined)).toBe(true);
  });

  it("Should allow valid job data", () => {
    const mockData = {
      key: "value",
    };

    expect(isJobData(mockData)).toBe(true);
  });
});
