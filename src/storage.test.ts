import {
  JobStorageKeys,
  getJobsFromCookie,
  getJobsFromLocalStorage,
} from "./storage";
import { Job, QOSLevels } from "./job";

describe("Session Storage", () => {
  beforeEach(() => {
    const mockJobs: Job[] = [
      {
        qos: QOSLevels.AtLeastOnce,
        topic: "mock-topic",
      },
    ];

    localStorage.setItem(JobStorageKeys.LocalStorage, JSON.stringify(mockJobs));
  });

  it("Should get jobs from local storage", () => {
    const localStorageJobs = getJobsFromLocalStorage();

    expect(Array.isArray(localStorageJobs)).toBe(true);
    expect(localStorageJobs.length).toBe(1);

    const mockJob = localStorageJobs.pop();

    expect(mockJob?.qos).toBe(QOSLevels.AtLeastOnce);
    expect(mockJob?.topic).toBe("mock-topic");
  });

  it("Should return a blank array when no jobs are present", () => {
    window.localStorage.removeItem(JobStorageKeys.LocalStorage);

    const localStorageJobs = getJobsFromLocalStorage();

    expect(Array.isArray(localStorageJobs)).toBe(true);
    expect(localStorageJobs.length).toBe(0);
  });

  it("Should return a blank array when corrupt jobs are present", () => {
    localStorage.setItem(JobStorageKeys.LocalStorage, JSON.stringify({}));

    const localStorageJobs = getJobsFromLocalStorage();

    expect(Array.isArray(localStorageJobs)).toBe(true);
    expect(localStorageJobs.length).toBe(0);
  });
});

describe("Cookie Storage", () => {
  beforeEach(() => {
    const mockJobs: Job[] = [
      {
        qos: QOSLevels.AtLeastOnce,
        topic: "mock-topic",
      },
    ];

    document.cookie = `${JobStorageKeys.Cookie}=${JSON.stringify(mockJobs)};`;
  });

  it("Should get jobs from cookies", () => {
    const cookieJobs = getJobsFromCookie();

    expect(Array.isArray(cookieJobs)).toBe(true);
    expect(cookieJobs.length).toBe(1);

    const mockJob = cookieJobs.pop();

    expect(mockJob?.qos).toBe(QOSLevels.AtLeastOnce);
    expect(mockJob?.topic).toBe("mock-topic");
  });

  it("Should return a blank array when no jobs are present", () => {
    document.cookie = `${JobStorageKeys.Cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

    const cookieJobs = getJobsFromCookie();

    expect(Array.isArray(cookieJobs)).toBe(true);
    expect(cookieJobs.length).toBe(0);
  });

  it("Should return a blank array when corrupt jobs are present", () => {
    document.cookie = `${JobStorageKeys.Cookie}=${JSON.stringify({})};`;

    const cookieJobs = getJobsFromCookie();

    expect(Array.isArray(cookieJobs)).toBe(true);
    expect(cookieJobs.length).toBe(0);
  });
});
