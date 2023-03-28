namespace Cypress {
  interface Chainable {
    signIn(email: string, password: string): Chainable;
  }
}
