import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  getFirestore,
} from "firebase/firestore";
import { FIREBASE_CONFIG } from "../../../firebase.config";
// import { getEmulatorUrl } from "@/services/firebase/utils";
import { FirebaseServices } from "@/services/firebase/types";
import {
  EMULATOR_BASE_URL,
  EMULATOR_PORT,
} from "@/services/firebase/constants";

function getRawServices(): FirebaseServices {
  const app = initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  const firestore = getFirestore__TEST_COMPATIBLE(app);
  return { app, auth, firestore };
}

function getFirestore__TEST_COMPATIBLE(app: FirebaseApp) {
  if (process.env.NODE_ENV === "development") {
    // We use initializeFirestore here to prevent errors on Cypress tests
    // See https://github.com/firebase/firebase-js-sdk/issues/1674
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } else {
    return getFirestore(app);
  }
}

function getServices(): FirebaseServices {
  const initializedApp = getApps().at(0);
  if (!initializedApp) {
    const services = getRawServices();
    if (process.env.NODE_ENV === "development") {
      const { auth, firestore } = services;

      // TODO: use "getEmulatorUrl" instead of hard coding the url
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
      connectFirestoreEmulator(
        firestore,
        EMULATOR_BASE_URL,
        EMULATOR_PORT.FIRESTORE
      );
    }
    return services;
  }

  return getRawServices();
}

export { getServices };
