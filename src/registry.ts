import { Job, JobData } from "./job.ts";

const registry = new Map<string, JobData>();

export const registerJob = (job: Job) => {
  registry.set(job.name, job.data);
};
