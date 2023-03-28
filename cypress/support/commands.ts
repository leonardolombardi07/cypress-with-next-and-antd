import { upsertUser } from "@/services/firebase";
import { getServices } from "@/services/firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const { auth } = getServices();

interface Credentials {
  email: string;
  password: string;
}

/// <reference types="cypress" />
// ***********************************************

Cypress.Commands.add("signIn", (email, password) => {
  cy.wrap(null).then(() => {
    return signIn({ email, password }).then(() => {
      cy.log("Hey");
    });
  });
});

async function signIn({ email, password }: Credentials) {
  return new Cypress.Promise(async (resolve, reject) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      mockPopupSignIn({ email, password });
      resolve("");
    } catch (error) {
      // If user already exists, just sign in
      mockPopupSignIn({ email, password });
      resolve("");
    }
  });
}

async function mockPopupSignIn({ email, password }: Credentials) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await upsertUser({ name: user.displayName || "", uid: user.uid });
  return null;
}
