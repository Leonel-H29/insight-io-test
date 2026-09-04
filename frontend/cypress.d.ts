declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
    loginAs(email: string, password: string): Chainable<void>;
  }
}
