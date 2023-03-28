import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as fbOnAuthStateChanged,
  NextOrObserver,
  User,
  ErrorFn,
  CompleteFn,
  signOut as fbSignOut,
} from "firebase/auth";
import { getServices } from "@/services/firebase/app";
import { upsertUser } from "../users";

const { auth } = getServices();

async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  if (!user.displayName) {
    throw new Error(`Signed user must have a display name`);
  }

  if (!user.email) {
    throw new Error(`Signed user must have an email`);
  }

  upsertUser({ name: user.displayName, uid: user.uid });
}

function signOut() {
  return fbSignOut(auth);
}

function onAuthStateChanged(
  nextOrObserver: NextOrObserver<User>,
  error?: ErrorFn,
  completed?: CompleteFn
) {
  return fbOnAuthStateChanged(auth, nextOrObserver, error, completed);
}

export { signInWithGoogle, onAuthStateChanged, signOut };
