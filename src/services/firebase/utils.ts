import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { getServices } from "@/services/firebase/app";
import { EMULATOR_BASE_URL } from "@/services/firebase/constants";
import { CollectionName, EmulatorPort } from "@/services/firebase/types";
import { FirestoreUser } from "./users";

const { firestore } = getServices();

function getTypedCollection<T = DocumentData>(path: CollectionName) {
  return collection(firestore, path) as CollectionReference<T>;
}

function getEmulatorUrl(port: EmulatorPort) {
  return `${EMULATOR_BASE_URL}/${port}`;
}

function getCollections() {
  const usersCol = getTypedCollection<FirestoreUser>("users");
  return { usersCol };
}

export { getCollections, getEmulatorUrl };
