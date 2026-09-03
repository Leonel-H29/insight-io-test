describe('Task management', () => {
  it('logs in, creates a task, starts it and marks it done', () => {
    cy.login();
    const title = `Cypress task ${Date.now()}`;
    cy.get('input[placeholder="What needs to be done?"]').type(title);
    cy.contains('button', 'Add task').click();
    cy.contains(title).parents('.card').within(() => {
      cy.contains('button', 'Start').click();
      cy.contains('button', 'Mark as Done').click();
      cy.contains('DONE').should('be.visible');
    });
  });
});
