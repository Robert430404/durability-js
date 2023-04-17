/** Different pieces of data that you can pass to the job */
type SerializablePrimitives = number | string | boolean;

/** Represents serializable data for the job */
export type JobData = {
  [key: string]:
    | SerializablePrimitives
    | JobData
    | Array<SerializablePrimitives | JobData>;
};

/** Represents the job object */
export type Job = {
  name: string;
  data: JobData;
};
