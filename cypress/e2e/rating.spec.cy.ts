const MAX_VALUE = 5;
const MIN_VALUE = -5;
const STEP = 0.1;

describe("rating spec", () => {
  beforeEach(() => {
    cy.visit("/signin");
    cy.signIn("leo@email.com", "leo123456");
  });

  it("should be able to rate another user", () => {
    // NOTE: this won't work with RatedUserCards!

    cy.get(".ant-slider-handle-2").as("slider-handle");
    const targetValue = 3.5;

    cy.get("@slider-handle")
      .invoke("attr", "aria-valuenow")
      .then((value) => {
        const currentValue = Number(value);
        const numOfSteps = (targetValue - currentValue) / STEP;
        const arrows = "{rightarrow}".repeat(numOfSteps);
        return arrows;
      })
      .then((arrows) => {
        cy.get("@slider-handle").type(arrows);
        cy.get("@slider-handle").should(
          "have.attr",
          "aria-valuenow",
          String(targetValue)
        );
      });
  });
});
