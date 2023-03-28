import { CollectionName, EmulatorPort, FirebaseServices } from "./types";

export const COLLECTION_NAME: {
  [key in Uppercase<CollectionName>]: CollectionName;
} = {
  USERS: "users",
} as const;

export const EMULATOR_PORT: {
  AUTH: EmulatorPort;
  FIRESTORE: EmulatorPort;
} = {
  AUTH: 9099,
  FIRESTORE: 8080,
} as const;

// Do not use "localhost" to properly connect to Cypress
// See: https://stackoverflow.com/questions/72749391/firebase-admin-gives-error-econnrefused-on-connecting-to-auth-emulator
export const EMULATOR_BASE_URL = "127.0.0.1";
