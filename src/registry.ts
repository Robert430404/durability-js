import { Job, JobData, QOS } from "./job.ts";

/** Represents the job registries */
type JobRegistryMaps = {
  [X in QOS]: Map<string, Job[]>;
};

/** Represents a handler function for a consumer */
type ConsumerHandler = (data?: JobData) => void;

type RegisteredConsumer = {
  handler: ConsumerHandler;
  seenJobs: string[];
};

/** The arguments that we pass to registration functions */
type RegisterConsumerArgs = {
  topic: string;
  handler: ConsumerHandler;
};

/** Contains all jobs loaded into the system */
const jobRegistries: JobRegistryMaps = {
  [QOS.Zero]: new Map(),
  [QOS.One]: new Map(),
  [QOS.Two]: new Map(),
};

/** Contains all of the consumers for a specified topic */
const consumerRegistry = new Map<string, RegisteredConsumer[]>();

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

/** Returns the requested registry for manipulation */
export const getJobRegistry = (qos: QOS) => jobRegistries[qos];

/** Returns the consumer registry for manipulation */
export const getConsumerRegistry = () => consumerRegistry;
