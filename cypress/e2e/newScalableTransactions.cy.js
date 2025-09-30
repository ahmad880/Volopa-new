/// <reference types="cypress" />

import { SigninPage } from "../PageObject/PageAction/SigninPage";
import * as cheerio from "cheerio";

const signin = new SigninPage();
let userName = "cpp216100";
let password = "Cpp8x9k21m3";

describe("Compare Transaction History Table - App1 vs App2", () => {
  it("should capture and compare transaction tables only", () => {
    
        sessionStorage.clear()
        cy.clearAllCookies({ log: true })
        cy.clearAllLocalStorage('your item', { log: true })
        cy.clearAllSessionStorage()
    
    cy.viewport(1920, 1080);

    // --- App1 ---
    cy.visit("https://webapp06.volopa-dev.com");
    signin.Login(userName, password);

    cy.contains("Cards").click();
    cy.contains("Transaction History").click();
    cy.get(".ant-spin-dot").should("not.exist");
    cy.wait(5000);

    //Apply transaction type filter
    cy.get('th:nth-child(3) div:nth-child(1) span:nth-child(2)').click();
    cy.get('label.ant-radio-wrapper span').contains('Credit (Payment Transaction)').click();
    cy.get(".ant-spin-dot").should("not.exist");
    cy.wait(5000);

    cy.get("table")
      .invoke("prop", "outerHTML")
      .then((app1Html) => {
        // --- App2 ---
        cy.origin(
          "https://webapp07.volopa-dev.com",
          { args: { userName, password } },
          ({ userName, password }) => {
            cy.visit("/");
            cy.get("#username").type(userName);
            cy.get("#password").type(password);
            cy.get('button[type="submit"]').click();

            cy.contains("Cards").click();
            cy.contains("Transaction History").click();
            cy.get(".ant-spin-dot").should("not.exist");
            cy.wait(5000);
            //Apply transaction type filter
            cy.get('th:nth-child(3) div:nth-child(1) span:nth-child(2)').click();
            cy.get('label.ant-radio-wrapper span').contains('Credit (Payment Transaction)').click();
            cy.get(".ant-spin-dot").should("not.exist");
            cy.wait(5000);

            // ✅ return App2 table
            return cy.get("table").invoke("prop", "outerHTML");
          }
        ).then((app2Html) => {
          // --- Compare here ---
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

          const htmlReport = `
            <html>
              <head>
                <title>Table Comparison Report</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  table { border-collapse: collapse; width: 100%; }
                  th, td { border: 1px solid #ddd; padding: 8px; }
                  th { background: #f2f2f2; }
                </style>
              </head>
              <body>
                <h2>Transaction Table Comparison</h2>
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

          // ✅ Save HTML report
          cy.writeFile("cypress/reports/table_mismatch_report.html", htmlReport);

          cy.log("📊 HTML report generated: table_mismatch_report.html");
        });
      });
  });
});
