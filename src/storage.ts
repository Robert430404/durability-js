import { Job, isJobCollection } from "./job.ts";

/** This is the key for jobs passed to the front-end from the back-end */
export const serverCookieKey = "durability:stored:server";

/** Pulls any jobs from the cookie */
export const getJobsFromCookie = (): Job[] => {
  // Grab the cookie value
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(serverCookieKey))
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
