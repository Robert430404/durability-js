# Overview

Durability JS is a durable event bus for event messaging in JS. It understands the concept of QoS levels and gives you more control over the delivery of your events via JavaScript.

## Getting Started

- Install [Volta](https://volta.sh)
- Start a new terminal session
- run `yarn`

## How do I use Durability JS?

After installing the package inside of your project, there are a few simple entrypoints for using the library.

```
/**
 * These are the primary methods of registering and sending jobs through the system
 */

// Registers a job inside of the desired registry
registerJob

// Dispatches a job directly to the consumers, and handles registering it in the registry for you
dispatchJob

// Register a consumer of jobs for a given topic
registerConsumer

// Dispatches all registered jobs to all registered consumers for their given topic
dispatchAllJobsFromRegistry
```

Inside of your application, you can stage and queue jobs up inside of the system before ever dispatching one to your job handler.
