/// <reference types="cypress" />
/// <reference path="../../cypress.d.ts" />

describe('Task management', () => {
  it('logs in, creates a task, starts it and marks it done', () => {
    cy.login();
    const title = `Cypress task ${Date.now()}`;
    cy.get('input[placeholder="What needs to be done?"]').type(title);
    cy.contains('button', 'Add task').click();
    cy.contains(title)
      .parents('.card')
      .within(() => {
        cy.contains('button', 'Start').click();
        cy.contains('button', 'Mark as Done').click();
        cy.contains('DONE').should('be.visible');
      });
  });

  const hasSecondUser = Boolean(
    Cypress.env('emailB') && Cypress.env('passwordB')
  );
  (hasSecondUser ? it : it.skip)(
    'shares tasks while keeping completion owner-only',
    () => {
      cy.login();
      const title = `Shared Cypress task ${Date.now()}`;
      cy.get('input[placeholder="What needs to be done?"]').type(title);
      cy.contains('button', 'Add task').click();
      cy.contains('button', 'Logout').click();
      cy.loginAs(
        Cypress.env('emailB') as string,
        Cypress.env('passwordB') as string
      );
      cy.contains(title)
        .parents('.card')
        .within(() => {
          cy.contains('View only: only the owner can modify this task.').should(
            'be.visible'
          );
          cy.contains('button', 'Mark as Done').should('not.exist');
        });
    }
  );
});
