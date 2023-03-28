import { getCollections } from "@/services/firebase/utils";
import {
  onSnapshot,
  QuerySnapshot,
  FirestoreError,
  setDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

export interface UserRating {
  value: number;
  uid: string; // uid of the user that rated
}

export interface FirestoreUser {
  uid: string;
  name: string;
  ratings: UserRating[];
}

const { usersCol } = getCollections();

interface UpsertUserForm {
  name: string;
  uid: string;
}

async function upsertUser({ name, uid }: UpsertUserForm) {
  // TODO: validate upsertUser with security rules

  const userDocRef = getUserDocRef(uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    setDoc(userDocRef, { name }, { merge: true });
  } else {
    setDoc(userDocRef, { uid, name, ratings: [] });
  }
}

async function rateUser(uid: string, rating: UserRating) {
  // TODO: validate rating with security rules

  const userDocRef = getUserDocRef(uid);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    throw new Error(`User with id ${uid} doesn't exist`);
  }

  const ratings = userDoc.data().ratings;
  const newRatings = ratings.find((r) => r.uid === rating.uid)
    ? [...ratings.filter((r) => r.uid !== rating.uid), rating] // remove old rating, add new rating
    : arrayUnion(rating); // add new rating
  setDoc(userDocRef, { ratings: newRatings }, { merge: true });
}

async function deleteRating(uid: string, raterUid: string) {
  const userDocRef = getUserDocRef(uid);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    throw new Error(`User with id ${uid} doesn't exist`);
  }

  const ratings = userDoc.data().ratings;
  if (!ratings.find((r) => r.uid === raterUid)) {
    // We couldn't find the user rating, so nothing to delete
    return;
  }

  setDoc(
    userDocRef,
    {
      ratings: ratings.filter((r) => r.uid !== raterUid),
    },
    { merge: true }
  );
}

function onUsersSnapshot(observer: {
  next: (snap: QuerySnapshot<FirestoreUser>) => void;
  error?: (error: FirestoreError) => void;
  complete?: () => void;
}) {
  return onSnapshot(usersCol, observer);
}

function getUserDocRef(uid: string) {
  return doc(usersCol, uid);
}

export { onUsersSnapshot, upsertUser, rateUser, deleteRating };
