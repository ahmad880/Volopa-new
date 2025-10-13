/// <reference types="cypress" />

import { SigninPage } from "../PageObject/PageAction/SigninPage";
import * as cheerio from "cheerio";

const signin = new SigninPage();
let userName = "cpp216100";
let password = "Cpp8x9k21m3";

describe("Compare Transaction History Table - App1 vs App2 (with Performance Report)", () => {
  it("should capture, compare tables, and log performance metrics", () => {

    sessionStorage.clear();
    cy.clearAllCookies({ log: true });
    cy.clearAllLocalStorage({ log: true });
    cy.clearAllSessionStorage();

    cy.viewport(1920, 1080);

    const capturePerformanceMetrics = (label) => {
      const pageLoadTimes = [];

      const logAndWaitForPageLoad = (pageNum) => {
        const start = performance.now();
        cy.get(".ant-spin-dot", { timeout: 20000 }).should("not.exist");
        const end = performance.now();
        const loadTime = (end - start).toFixed(2);
        pageLoadTimes.push(Number(loadTime));
        cy.log(`${label} - Page ${pageNum} loaded in ${loadTime} ms`);
      };

      // Wait for initial table load
      cy.get(".ant-spin-dot").should("not.exist");
      logAndWaitForPageLoad(1);

      // Navigate next 4 pages
      for (let i = 2; i <= 5; i++) {
        cy.get(".ant-pagination-next button").click({ force: true });
        cy.get(".ant-spin-dot").should("not.exist");
        logAndWaitForPageLoad(i);
        cy.wait(2000);
      }

      cy.wrap(pageLoadTimes).as(`${label}_times`);
    };

    const calculateAverage = (times) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      return avg.toFixed(2);
    };

    // ===============================
    // 🟦 APP 1 - WEBAPP06
    // ===============================
    cy.visit("https://webapp06.volopa-dev.com");
    signin.Login(userName, password);

    cy.contains("Cards").click();
    cy.contains("Transaction History").click();
    cy.get(".ant-spin-dot").should("not.exist");
    cy.wait(3000);

    // Apply transaction type filter
    // cy.get('th:nth-child(3) div:nth-child(1) span:nth-child(2)').click();
    // cy.get('label.ant-radio-wrapper span').contains("POS Transaction").click();
    // cy.get(".ant-spin-dot").should("not.exist");
    // cy.wait(3000);

    capturePerformanceMetrics("Webapp06");

    cy.get("table")
      .invoke("prop", "outerHTML")
      .then((app1Html) => {
        // ===============================
        // 🟩 APP 2 - WEBAPP07
        // ===============================
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
            cy.wait(3000);

            // cy.get('th:nth-child(3) div:nth-child(1) span:nth-child(2)').click();
            // cy.get('label.ant-radio-wrapper span').contains("POS Transaction").click();
            // cy.get(".ant-spin-dot").should("not.exist");
            // cy.wait(3000);

            // Performance metrics for webapp07
            const pageLoadTimes = [];

            const logAndWaitForPageLoad = (pageNum) => {
              const start = performance.now();
              cy.get(".ant-spin-dot", { timeout: 20000 }).should("not.exist");
              const end = performance.now();
              const loadTime = (end - start).toFixed(2);
              pageLoadTimes.push(Number(loadTime));
              cy.log(`Webapp07 - Page ${pageNum} loaded in ${loadTime} ms`);
            };

            logAndWaitForPageLoad(1);
            for (let i = 2; i <= 5; i++) {
              cy.get(".ant-pagination-next button").click({ force: true });
              cy.get(".ant-spin-dot").should("not.exist");
              logAndWaitForPageLoad(i);
              cy.wait(2000);
            }

            cy.wrap(pageLoadTimes).as("Webapp07_times");

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

          // Collect both times
          cy.get("@Webapp06_times").then((app1Times) => {
            cy.get("@Webapp07_times").then((app2Times) => {
              const avgApp1 = calculateAverage(app1Times);
              const avgApp2 = calculateAverage(app2Times);

              const htmlReport = `
                <html>
                  <head>
                    <title>Table & Performance Comparison Report</title>
                    <style>
                      body { font-family: Arial, sans-serif; margin: 20px; }
                      table { border-collapse: collapse; width: 100%; margin-bottom: 40px; }
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

                    <h2>Performance Summary</h2>
                    <table>
                      <thead>
                        <tr><th>App</th><th>Page 1</th><th>Page 2</th><th>Page 3</th><th>Page 4</th><th>Page 5</th><th>Average (ms)</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Webapp06</td>
                          ${app1Times.map((t) => `<td>${t}</td>`).join("")}
                          <td><b>${avgApp1}</b></td>
                        </tr>
                        <tr>
                          <td>Webapp07</td>
                          ${app2Times.map((t) => `<td>${t}</td>`).join("")}
                          <td><b>${avgApp2}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </body>
                </html>
              `;

              // ✅ Save HTML report
              cy.writeFile(
                "cypress/reports/table_performance_report.html",
                htmlReport
              );

              cy.log("📊 Performance report generated: table_performance_report.html");
            });
          });
        });
      });
  });
});
