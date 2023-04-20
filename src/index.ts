import { dispatchJob } from "./dispatcher.ts";
import { Job, QOS } from "./job.ts";
import { registerJob } from "./registry.ts";

const job: Job = {
  topic: "robs-topic",
  qos: QOS.Zero,
};

// Registers the job with the registry
registerJob(job);

// Immediately dispatches the job
dispatchJob(job);
