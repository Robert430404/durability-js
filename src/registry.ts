import { Job, JobData, QOSLevels, JobStore } from "./job";
import {
  getAllStoredJobs,
  getJobsFromIndexedDB,
  setCookieJob,
  setIDBJob,
  setLocalJob,
} from "./storage";

/** Represents the job registries */
type JobRegistryMaps = {
  [X in QOSLevels]: Map<string, Job[]>;
};

/** Represents a handler function for a consumer */
type ConsumerHandler = (data?: JobData) => void;

/** Defines a registry entry for a consumer */
type RegisteredConsumer = {
  // This handles the job as the user wants
  handler: ConsumerHandler;

  // This keeps track of whether or not a job has been seen for QOS 2
  seenJobs: Map<string, null>;
};

/** The arguments that we pass to registration functions */
type RegisterConsumerArgs = {
  topic: string;
  handler: ConsumerHandler;
};

/** Contains all jobs loaded into the system */
const jobRegistries: JobRegistryMaps = {
  [QOSLevels.AtMostOnce]: new Map(),
  [QOSLevels.AtLeastOnce]: new Map(),
  [QOSLevels.ExactlyOnce]: new Map(),
};

/** Contains all of the consumers for a specified topic */
const consumerRegistry = new Map<string, RegisteredConsumer[]>();

/** Event name that tells the application we've loaded all of our jobs */
export const jobsLoadedEvent = "durability:jobs:loaded";

/** Returns the requested registry for manipulation */
export const getJobRegistry = (qos: QOSLevels) => jobRegistries[qos];

/** Returns the consumer registry for manipulation */
export const getConsumerRegistry = () => consumerRegistry;

/** Handles registering the job with the registry internally */
const registerJobWithRegistry = (job: Job): void => {
  const { topic, qos } = job;

  const registry = jobRegistries[qos];

  if (!registry.has(topic)) {
    registry.set(topic, [job]);

    return;
  }

  const existingJobs = registry.get(topic);

  if (!Array.isArray(existingJobs)) {
    throw new Error(`qos ${qos} registry is corrupt`);
  }

  existingJobs.push(job);
};

/** Registers a job with the appropriate registry */
export const registerJob = (job: Job): void => {
  if (job.isDurable === JobStore.Cookie) {
    setCookieJob(job);
  }

  if (job.isDurable === JobStore.LocalStorage) {
    setLocalJob(job);
  }

  if (job.isDurable === JobStore.IndexedDB) {
    setIDBJob(job);
  }

  registerJobWithRegistry(job);
};

/** Registers a consumer with the system */
export const registerConsumer = ({ topic, handler }: RegisterConsumerArgs) => {
  if (!consumerRegistry.has(topic)) {
    consumerRegistry.set(topic, []);
  }

  const existingHandlers = consumerRegistry.get(topic);

  if (!Array.isArray(existingHandlers)) {
    throw new Error("consumer registry is corrupt");
  }

  existingHandlers.push({
    handler,
    seenJobs: new Map<string, null>(),
  });

  /**
   * Send all jobs to the newly registered handler
   * that need to be seen at least once
   */
  getJobRegistry(QOSLevels.AtLeastOnce)
    .get(topic)
    ?.forEach((job) => {
      handler(job.data);
    });

  /**
   * Send all jobs to the newly registered handler
   * that need to be seen exactly once
   */
  getJobRegistry(QOSLevels.ExactlyOnce)
    .get(topic)
    ?.forEach((job) => {
      existingHandlers.forEach((entry) => {
        // If this job has already been played for this consumer skip it
        if (entry.seenJobs.has(JSON.stringify(job))) {
          return;
        }

        // Add the job to the seen jobs for the consumer and send it
        entry.seenJobs.set(JSON.stringify(job), null);
        entry.handler(job.data);
      });
    });
};

/** Load the jobs from all blocking storage locations into the registry */
getAllStoredJobs().forEach(registerJobWithRegistry);

/** Load the jobs from all async storage locations into the registry */
getJobsFromIndexedDB()
  .then((jobs) => {
    jobs.forEach(registerJobWithRegistry);
  })
  .then(() => {
    // Dispatch an event letting listeners know they're loaded
    window.dispatchEvent(new Event(jobsLoadedEvent));
  });
