import { Job, QOSLevels } from "./job";
import { getConsumerRegistry, getJobRegistry, registerJob } from "./registry";

/** Sends a job along the bus */
export const dispatchJob = (job: Job) => {
  registerJob(job);

  const { topic, qos } = job;
  const consumers = getConsumerRegistry().get(topic);

  if (!Array.isArray(consumers)) {
    return;
  }

  // Assures that a job is dispatched to the handler only once
  if (qos === QOSLevels.ExactlyOnce) {
    consumers.forEach((entry) => {
      // If this job has already been played for this consumer skip it
      if (entry.seenJobs.has(JSON.stringify(job))) {
        return;
      }

      // Add the job to the seen jobs for the consumer and send it
      entry.seenJobs.set(JSON.stringify(job), null);
      entry.handler(job.data);
    });

    return;
  }

  // Just send out the job immediately if there are no limits
  consumers.forEach((entry) => {
    entry.handler(job.data);
  });
};

/** Plays the jobs from the registry when called */
export const dispatchAllJobsFromRegistry = () => {
  getJobRegistry(QOSLevels.AtMostOnce).forEach((entry) =>
    entry.forEach(dispatchJob)
  );

  getJobRegistry(QOSLevels.AtLeastOnce).forEach((entry) =>
    entry.forEach(dispatchJob)
  );

  getJobRegistry(QOSLevels.ExactlyOnce).forEach((entry) =>
    entry.forEach(dispatchJob)
  );
};
