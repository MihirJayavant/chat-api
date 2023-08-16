import {
  CommunicationProtocolEnum,
  DaprClient,
  DaprServer,
} from "npm:@dapr/dapr";
import UserActor from "/actors/profile.actor.ts";

const daprHost = "127.0.0.1";
const daprPort = "50000";
const serverHost = "127.0.0.1";
const serverPort = "50001";

// Configure the actor runtime with the DaprClientOptions.
const clientOptions = {
  daprHost: daprHost,
  daprPort: daprPort,
  communicationProtocol: CommunicationProtocolEnum.HTTP,
  actor: {
    actorIdleTimeout: "1h",
    actorScanInterval: "30s",
    drainOngoingCallTimeout: "1m",
    drainRebalancedActors: true,
    reentrancy: {
      enabled: true,
      maxStackDepth: 32,
    },
    remindersStoragePartitions: 0,
  },
};

export async function daprInit() {
  const server = new DaprServer({ serverHost, serverPort, clientOptions });

  const client = new DaprClient(clientOptions);
  await server.actor.init(); // Let the server know we need actors
  server.actor.registerActor(UserActor); // Register the actor
  await server.start(); // Start the server

  // To get the registered actors, you can invoke `getRegisteredActors`:
  const resRegisteredActors = await server.actor.getRegisteredActors();
  console.log(`Registered Actors: ${JSON.stringify(resRegisteredActors)}`);
}
