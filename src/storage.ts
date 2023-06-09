import { DBSchema, IDBPDatabase, openDB } from "idb";
import { IDBJob, Job, isJobCollection } from "./job";

/** IndexedDB configuration */
enum DBConfiguration {
  ConnectionName = "durability-js",
  Version = 1,
  StoreName = "jobs",
}

/** Represents the IDB schema */
interface JobSchema extends DBSchema {
  [DBConfiguration.StoreName]: {
    key: string;
    value: IDBJob;
  };
}

/** Stores single reference to the IDB connection */
let connection: IDBPDatabase<JobSchema>;

/** The storage keys for the various mediums */
export enum JobStorageKeys {
  Cookie = "durability:stored:server",
  LocalStorage = "durability:stored:local",
}

/** Exposes and returns the DB connection */
const getIndexedDBConnection = async (): Promise<IDBPDatabase<JobSchema>> => {
  const resolved =
    connection ||
    (await openDB(DBConfiguration.ConnectionName, DBConfiguration.Version, {
      upgrade: (db, oldVersion, newVersion) => {
        if (oldVersion === newVersion) {
          return;
        }

        // Setup the schema for IndexedDB
        db.createObjectStore(DBConfiguration.StoreName, {
          keyPath: "jobId",
          autoIncrement: true,
        });
      },
    }));

  if (!connection) {
    connection = resolved;
  }

  return resolved;
};

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

/** Pulls any jobs from IndexedDB */
export const getJobsFromIndexedDB = async (): Promise<IDBJob[]> => {
  const connection = await getIndexedDBConnection();
  const storedJobs = await connection.getAll(DBConfiguration.StoreName);

  if (!storedJobs) {
    return [];
  }

  if (!isJobCollection(storedJobs)) {
    return [];
  }

  return storedJobs;
};

/** Pulls all stored jobs from all storage locations */
export const getAllStoredJobs = (): Job[] => [
  ...getJobsFromCookie(),
  ...getJobsFromLocalStorage(),
];

export const setLocalJob = (job: Job): void => {
  const existingJobs = getJobsFromLocalStorage();

  existingJobs.push(job);

  localStorage.setItem(
    JobStorageKeys.LocalStorage,
    JSON.stringify(existingJobs)
  );
};

export const setCookieJob = (job: Job): void => {
  const existingJobs = getJobsFromCookie();

  existingJobs.push(job);

  document.cookie = `${JobStorageKeys.Cookie}=${JSON.stringify(existingJobs)}`;
};

export const setIDBJob = async (job: IDBJob): Promise<void> => {
  const connection = await getIndexedDBConnection();

  await connection.add(DBConfiguration.StoreName, job);
};

export const deleteIDBJob = async (jobId: string) => {
  const connection = await getIndexedDBConnection();

  await connection.delete(DBConfiguration.StoreName, jobId);
};
