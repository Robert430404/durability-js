import { isJob, isJobCollection, isJobData } from "./job";

describe("isJob Guard", () => {
  it("Should block invalid jobs", () => {
    const mockData = {};

    expect(isJob(mockData)).toBe(false);
  });
});

describe("isJobCollection Guard", () => {
  it("Should block an invalid job set", () => {
    const mockData = [{}];

    expect(isJobCollection(mockData)).toBe(false);
  });
});

describe("isJobData Guard", () => {
  it("Should reject invalid data", () => {
    const mockData = false;

    expect(isJobData(mockData)).toBe(false);
  });
});
