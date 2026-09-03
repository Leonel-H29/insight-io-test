Cypress.Commands.add('login', () => {
  const domain = Cypress.env('auth0Domain') as string;
  const email = Cypress.env('email') as string;
  const password = Cypress.env('password') as string;
  if (!domain || !email || !password)
    throw new Error(
      'Configure CYPRESS_auth0Domain, CYPRESS_email and CYPRESS_password for the real Auth0 E2E test.'
    );
  cy.visit('/login');
  cy.contains('button', 'Sign in with Auth0').click();
  cy.origin(
    `https://${domain}`,
    { args: { email, password } },
    ({ email: userEmail, password: userPassword }) => {
      cy.get('input[name="username"]').type(userEmail);
      cy.get('input[name="password"]').type(userPassword, { log: false });
      cy.get('button[type="submit"]').click();
    }
  );
  cy.url().should('include', '/tasks');
});
