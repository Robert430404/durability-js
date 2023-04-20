/** Different pieces of data that you can pass to the job */
type SerializablePrimitives = number | string | boolean;

/** The QOS levels available to the system */
export enum QOS {
  // Broadcasts a job to everyone currently listening with no assured delivery
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
  topic: string;
  qos: QOS;
  data: JobData;
};
