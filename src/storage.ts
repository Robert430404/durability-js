import { Job } from "./job.ts";

/** This is the key for jobs passed to the front-end from the back-end */
export const serverCookieKey = "durability:stored:server";

export const getJobsFromCookie = (): Job[] => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(serverCookieKey))
    ?.split("=")
    ?.pop();

  if (!cookie) {
    return [];
  }

  return JSON.parse(cookie);
};
