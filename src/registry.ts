import { Job, JobData, QOSLevels } from "./job.ts";
import { getAllStoredJobs, getJobsFromIndexedDB } from "./storage.ts";

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
  seenJobs: string[];
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

export const jobsLoadedEvent = "durability:jobs:loaded";

/** Returns the requested registry for manipulation */
export const getJobRegistry = (qos: QOSLevels) => jobRegistries[qos];

/** Returns the consumer registry for manipulation */
export const getConsumerRegistry = () => consumerRegistry;

/** Registers a job with the appropriate registry */
export const registerJob = (job: Job): void => {
  const { topic, qos } = job;

  // TODO: Implement durability

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
    seenJobs: [],
  });
};

/** Load the jobs from all blocking storage locations into the registry */
getAllStoredJobs().forEach(registerJob);

/** Load the jobs from all async storage locations into the registry */
getJobsFromIndexedDB()
  .then((jobs) => {
    jobs.forEach(registerJob);
  })
  .then(() => {
    // Dispatch an event letting listeners know they're loaded
    document.dispatchEvent(new Event(jobsLoadedEvent));
  });
