/// <reference types="cypress" />

import { SigninPage } from "../PageObject/PageAction/SigninPage";
import * as cheerio from "cheerio";

const signin = new SigninPage();
let userName = "cpp216233";
let password = "Cpp8x9k21m3";

describe("Compare Transaction History Table - App1 vs App2 (with Performance Report)", () => {
  it("should capture, compare tables, and log performance metrics", () => {

    sessionStorage.clear();
    cy.clearAllCookies({ log: true });
    cy.clearAllLocalStorage('your item', { log: true });
    cy.clearAllSessionStorage();

    cy.viewport(1920, 1080);

    // --- App1 ---
    let app1LoadTimes = [];

    const measurePageLoad = (pageNum, timesArray) => {
      const start = performance.now();
      cy.get('.ant-pagination-item')
        .contains(pageNum)
        .last()
        .click({ force: true });

      cy.get(".ant-spin-dot", { timeout: 15000 }).should("not.exist");
      cy.wait(1000);
      const end = performance.now();

      const loadTime = (end - start) / 1000;
      cy.log(`App1 - Page ${pageNum} load time: ${loadTime.toFixed(2)}s`);
      timesArray.push(loadTime);
    };

    cy.visit("https://webapp06.volopa-dev.com");
    const startApp1 = performance.now();
    signin.Login(userName, password);
    cy.contains("Cards").click();
    cy.contains("Transaction History").click();
    cy.get(".ant-spin-dot").should("not.exist");
    const endApp1 = performance.now();

    const initialLoadApp1 = (endApp1 - startApp1) / 1000;
    cy.log(`App1 - Initial page load time: ${initialLoadApp1.toFixed(2)}s`);

    cy.wait(3000);
    // cy.get('th:nth-child(3) div:nth-child(1) span:nth-child(2)').click();
    // cy.get('label.ant-radio-wrapper span').contains('POS Transaction').click();
    // cy.get(".ant-spin-dot").should("not.exist");
    // cy.wait(3000);

    // Capture performance for 5 pages
    cy.then(() => {
      for (let i = 2; i <= 6; i++) {
        measurePageLoad(i, app1LoadTimes);
      }
    });

    // Capture App1 table after navigation
    cy.get("table")
      .invoke("prop", "outerHTML")
      .then((app1Html) => {
        // --- App2 ---
        let app2LoadTimes = [];

        cy.origin(
          "https://webapp07.volopa-dev.com",
          { args: { userName, password } },
          ({ userName, password }) => {
            cy.visit("/");
            const startApp2 = performance.now();
            cy.get("#username").type(userName);
            cy.get("#password").type(password);
            cy.get('button[type="submit"]').click();

            cy.contains("Cards").click();
            cy.contains("Transaction History").click();
            cy.get(".ant-spin-dot").should("not.exist");
            const endApp2 = performance.now();

            const initialLoadApp2 = (endApp2 - startApp2) / 1000;
            cy.log(`App2 - Initial page load time: ${initialLoadApp2.toFixed(2)}s`);

            cy.wait(3000);
            // cy.get('th:nth-child(3) div:nth-child(1) span:nth-child(2)').click();
            // cy.get('label.ant-radio-wrapper span').contains('POS Transaction').click();
            // cy.get(".ant-spin-dot").should("not.exist");
            // cy.wait(3000);

            // Helper function inside origin
            const measurePageLoadApp2 = (pageNum, timesArray) => {
              const start = performance.now();
              cy.get('.ant-pagination-item')
                .contains(pageNum)
                .last()
                .click({ force: true });
              cy.get(".ant-spin-dot", { timeout: 15000 }).should("not.exist");
              cy.wait(1000);
              const end = performance.now();
              const loadTime = (end - start) / 1000;
              cy.log(`App2 - Page ${pageNum} load time: ${loadTime.toFixed(2)}s`);
              timesArray.push(loadTime);
            };

            // Navigate through 5 pages
            cy.then(() => {
              for (let i = 2; i <= 6; i++) {
                measurePageLoadApp2(i, app2LoadTimes);
              }
            });

            // ✅ return App2 table
            return cy.get("table").invoke("prop", "outerHTML");
          }
        ).then((app2Html) => {
          // --- Compare Tables ---
          const $1 = cheerio.load(app1Html);
          const $2 = cheerio.load(app2Html);

          let rowsHtml = "";
          const maxRows = Math.max($1("tr").length, $2("tr").length);

          for (let i = 0; i < maxRows; i++) {
            const row1 = $1("tr").eq(i);
            const row2 = $2("tr").eq(i);

            let rowHtml = `<tr><td>${i + 1}</td>`;
            const maxCols = Math.max(
              row1.find("td,th").length,
              row2.find("td,th").length
            );

            for (let j = 0; j < maxCols; j++) {
              const v1 = row1.find("td,th").eq(j).text().trim() || "<missing>";
              const v2 = row2.find("td,th").eq(j).text().trim() || "<missing>";
              if (v1 === v2) {
                rowHtml += `<td>${v1}</td><td>${v2}</td>`;
              } else {
                rowHtml += `<td style="background:#ffcccc">${v1}</td><td style="background:#ccffcc">${v2}</td>`;
              }
            }

            rowHtml += "</tr>";
            rowsHtml += rowHtml;
          }

          // --- Generate HTML Report ---
          const htmlReport = `
            <html>
              <head>
                <title>Table Comparison + Performance Report</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  table { border-collapse: collapse; width: 100%; }
                  th, td { border: 1px solid #ddd; padding: 8px; }
                  th { background: #f2f2f2; }
                </style>
              </head>
              <body>
                <h2>Transaction Table Comparison</h2>
                <p><b>App1 Initial Load:</b> ${initialLoadApp1.toFixed(2)}s</p>
                <p><b>App2 Initial Load:</b> Logged separately in Cypress logs</p>
                <h3>Table Comparison</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Webapp06</th>
                      <th>Webapp07</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rowsHtml}
                  </tbody>
                </table>
              </body>
            </html>
          `;

          cy.writeFile("cypress/reports/table_performance_comparison.html", htmlReport);
          cy.log("✅ HTML report generated: table_performance_comparison.html");
        });
      });
  });
});
