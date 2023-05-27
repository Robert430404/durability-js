import "fake-indexeddb/auto";
import { QOSLevels } from "./job";
import {
  JobStorageKeys,
  deleteIDBJob,
  getAllStoredJobs,
  getJobsFromCookie,
  getJobsFromIndexedDB,
  getJobsFromLocalStorage,
  setCookieJob,
  setIDBJob,
  setLocalJob,
} from "./storage";

describe("Session Storage", () => {
  beforeEach(() => {
    setLocalJob({
      qos: QOSLevels.AtLeastOnce,
      topic: "mock-topic",
    });
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
    setCookieJob({
      qos: QOSLevels.AtLeastOnce,
      topic: "mock-topic",
    });
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

describe("IndexedDB Storage", () => {
  it("Should get jobs from indexedDB", async () => {
    await setIDBJob({
      qos: QOSLevels.AtLeastOnce,
      topic: "mock-topic",
    });

    const indexedDBJobs = await getJobsFromIndexedDB();

    expect(Array.isArray(indexedDBJobs)).toBe(true);
    expect(indexedDBJobs.length).toBe(1);

    const mockJob = indexedDBJobs.pop();

    expect(mockJob?.qos).toBe(QOSLevels.AtLeastOnce);
    expect(mockJob?.topic).toBe("mock-topic");
  });

  it("Should return a blank array when no jobs are present", async () => {
    const existingJobs = await getJobsFromIndexedDB();

    if (existingJobs.length > 0) {
      await deleteIDBJob(existingJobs[0].jobId || "");
    }

    const indexedDBJobs = await getJobsFromIndexedDB();

    expect(Array.isArray(indexedDBJobs)).toBe(true);
    expect(indexedDBJobs.length).toBe(0);
  });

  it("Should return a blank array when corrupt jobs are present", async () => {
    const existingJobs = await getJobsFromIndexedDB();

    if (existingJobs.length > 0) {
      await deleteIDBJob(existingJobs[0].jobId || "");
    }

    const indexedDBJobs = await getJobsFromIndexedDB();

    expect(Array.isArray(indexedDBJobs)).toBe(true);
    expect(indexedDBJobs.length).toBe(0);
  });
});

describe("All Stored Jobs Retrevial", () => {
  beforeEach(() => {
    setLocalJob({
      qos: QOSLevels.AtLeastOnce,
      topic: "mock-topic-session",
    });

    setCookieJob({
      qos: QOSLevels.AtLeastOnce,
      topic: "mock-topic-cookies",
    });
  });

  it("Should return valid jobs", () => {
    const retreivedJobs = getAllStoredJobs();

    expect(Array.isArray(retreivedJobs)).toBe(true);
    expect(retreivedJobs.length).toBe(2);
  });
});
