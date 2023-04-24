/** Different pieces of data that you can pass to the job */
type SerializablePrimitives = number | string | boolean;

/**
 * The QOS levels available to the system
 *
 * @see https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/
 */
export enum QOS {
  // Broadcasts a job to everyone currently listening at most once
  Zero,

  // Broadcats a job that will be delivered at least once
  One,

  // Broadcats a job that will be delivered exactly once
  Two,
}

/** Represents serializable data for the job */
export type JobData = {
  [key: string]:
    | SerializablePrimitives
    | JobData
    | Array<SerializablePrimitives>
    | Array<JobData>;
};

/** Represents the job object */
export type Job = {
  isDurable?: boolean;
  data?: JobData;

  topic: string;
  qos: QOS;
};

/** Validates that we have valid job data */
export const isJobData = (x: unknown): x is JobData => {
  if (typeof x === "undefined") {
    return true;
  }

  if (!x) {
    return false;
  }

  if (typeof x !== "object") {
    return false;
  }

  return true;
};

/** Makes sure that we have a valid job */
export const isJob = (x: unknown): x is Job => {
  if (!x) {
    return false;
  }

  if (typeof x !== "object") {
    return false;
  }

  if (!Object.keys(x).includes("topic")) {
    return false;
  }

  if (typeof (x as Job).topic !== "string") {
    return false;
  }

  if (!Object.keys(x).includes("qos")) {
    return false;
  }

  if (typeof (x as Job).qos !== "number") {
    return false;
  }

  if (!isJobData((x as Job)?.data)) {
    return false;
  }

  if (
    Object.keys(x).includes("isDurable") &&
    typeof (x as Job).isDurable !== "undefined" &&
    typeof (x as Job).isDurable !== "boolean"
  ) {
    return false;
  }

  return true;
};

/** Validates a collection of jobs */
export const isJobCollection = (x: unknown[]): x is Job[] => {
  for (let i = 0; i < x.length; i += 1) {
    const currentJob = x[i];

    if (!isJob(currentJob)) {
      return false;
    }
  }

  return true;
};
