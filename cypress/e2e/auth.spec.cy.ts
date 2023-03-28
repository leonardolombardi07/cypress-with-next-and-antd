describe("auth spec", () => {
  it("should be able to mock the sign in", () => {
    cy.visit("/signin");
    cy.signIn("leo@email.com", "leo123456");
    cy.get("h1").contains(/home/i);
  });
});
