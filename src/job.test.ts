import { isJob, isJobCollection, isJobData } from "./job";

describe("isJob Guard", () => {
  it("Should block invalid jobs", () => {
    const mockData = {};

    expect(isJob(mockData)).toBe(false);
  });

  it("Should block an undefined job", () => {
    expect(isJob(undefined)).toBe(false);
  });
});

describe("isJobCollection Guard", () => {
  it("Should block an invalid job set", () => {
    const mockData = [{}];

    expect(isJobCollection(mockData)).toBe(false);
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
