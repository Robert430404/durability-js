import { JobData } from "./job.ts";

/** Events that consumer will have access to */
type ConsumerEvent = Event | CustomEvent<JobData>;

/** The arguments that we pass to registration functions */
type RegisterConsumerArgs = {
  topic: string;

  // ESLint can't tell that this is a type
  // eslint-disable-next-line no-unused-vars
  handler: (event: ConsumerEvent) => void;
};

/** Register a consumer for a topic with QOS 0 */
export const registerQosZeroConsumer = ({
  topic,
  handler,
}: RegisterConsumerArgs): void => {
  document.addEventListener(topic, handler);
};

export const registerQosOneConsumer = ({
  topic,
  handler,
}: RegisterConsumerArgs) => {
  document.addEventListener(topic, handler);
};
