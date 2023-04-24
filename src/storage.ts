import { Job, isJobCollection } from "./job.ts";

/** The storage keys for the various mediums */
export enum JobStorageKeys {
  Cookie = "durability:stored:server",
  LocalStorage = "durability:stored:local",
}

/** Pulls any jobs from the cookie */
export const getJobsFromCookie = (): Job[] => {
  // Grab the cookie value
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(JobStorageKeys.Cookie))
    ?.split("=")[1];

  if (!cookie) {
    return [];
  }

  const cookieJobs = JSON.parse(cookie);

  if (!isJobCollection(cookieJobs)) {
    return [];
  }

  return cookieJobs;
};

/** Pulls any jobs from local storage */
export const getJobsFromLocalStorage = (): Job[] => {
  const storedJobs = localStorage.getItem(JobStorageKeys.LocalStorage);

  if (!storedJobs) {
    return [];
  }

  const parsedJobs = JSON.parse(storedJobs);

  if (!isJobCollection(parsedJobs)) {
    return [];
  }

  return parsedJobs;
};

/** Pulls all stored jobs from all storage locations */
export const getAllStoredJobs = (): Job[] => [
  ...getJobsFromCookie(),
  ...getJobsFromLocalStorage(),
];
