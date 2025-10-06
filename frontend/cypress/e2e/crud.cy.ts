describe('CRUD de Clientes', () => {
  beforeEach(() => {
    // Intercepta a chamada inicial para garantir que a tabela esteja vazia ou com dados controlados
    cy.intercept('GET', 'http://localhost:3000/clients', { fixture: 'clients.json' }).as('getClients');
    cy.visit('/');
  });

  it('deve navegar para a lista de clientes, criar, editar e excluir um cliente', () => {
    const uniqueId = Date.now();
    const initialName = `Cypress User ${uniqueId}`;
    const initialEmail = `cypress.${uniqueId}@example.com`;
    const updatedName = `Cypress User Updated ${uniqueId}`;

    // --- Tela Inicial ---
    cy.get('input[placeholder="Digite seu nome"]').type('Test User');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/customers');
    cy.wait('@getClients');

    // --- Criar Novo Cliente ---
    cy.get('button').contains('Novo Cliente').click();
    cy.get('h2').contains('Novo Cliente').should('be.visible');
    cy.get('input#name').type(initialName);
    cy.get('input#email').type(initialEmail);

    cy.intercept('POST', 'http://localhost:3000/clients').as('createClient');
    cy.intercept('GET', 'http://localhost:3000/clients', {
      body: [{ id: 1, name: initialName, email: initialEmail }],
    }).as('getClientsAfterCreate');

    cy.get('button[type="submit"]').contains('Salvar').click();
    cy.wait('@createClient');
    cy.wait('@getClientsAfterCreate');

    // Verificar se o novo cliente está na tabela
    cy.contains('td', initialName).should('be.visible');
    cy.contains('td', initialEmail).should('be.visible');

    // --- Editar Cliente ---
    cy.contains('tr', initialName).within(() => {
      cy.get('button').contains('Editar').click();
    });
    cy.get('h2').contains('Editar Cliente').should('be.visible');
    cy.get('input#name').clear().type(updatedName);

    cy.intercept('PATCH', 'http://localhost:3000/clients/*').as('updateClient');
    cy.intercept('GET', 'http://localhost:3000/clients', {
      body: [{ id: 1, name: updatedName, email: initialEmail }],
    }).as('getClientsAfterUpdate');

    cy.get('button[type="submit"]').contains('Salvar').click();
    cy.wait('@updateClient');
    cy.wait('@getClientsAfterUpdate');

    // Verificar se o cliente foi atualizado
    cy.contains('td', updatedName).should('be.visible');
    cy.contains('td', initialName).should('not.exist');

    // --- Excluir Cliente ---
    cy.contains('tr', updatedName).within(() => {
      cy.get('button').contains('Excluir').click();
    });

    // Cypress automaticamente lida com o window.confirm
    cy.intercept('DELETE', 'http://localhost:3000/clients/*').as('deleteClient');
    cy.intercept('GET', 'http://localhost:3000/clients', { body: [] }).as('getClientsAfterDelete');

    cy.wait('@deleteClient');
    cy.wait('@getClientsAfterDelete');

    // Verificar se o cliente foi removido
    cy.contains('td', updatedName).should('not.exist');
  });
});
