/// <reference types="cypress" />

import { SigninPage } from "../PageObject/PageAction/SigninPage";

const signin = new SigninPage();
let userName = "cpp217609";
let password = "Cpp8x9k21m3";

// Improved cleaning function with more comprehensive normalization
function clean(val) {
  if (!val) return "";
  return val
    .replace(/\u00A0/g, " ") // Non-breaking spaces
    .replace(/\s+/g, " ")    // Multiple spaces to single space
    .replace(/[\r\n\t]/g, " ") // Line breaks and tabs
    .trim()
    .toLowerCase(); // Normalize case for comparison
}

// Create a unique key using ALL columns of the row for complete comparison
function createCompleteRowKey(row) {
  return row.join("||"); // Use || as separator to avoid conflicts
}

// Format row data for readable logging
function formatRowForDisplay(row, headers = []) {
  if (!row || row.length === 0) return "Empty row";
  
  return row.map((value, index) => {
    const header = headers[index] || `Col${index + 1}`;
    return `${header}: "${value}"`;
  }).join(" | ");
}

// Advanced comparison function that handles duplicates and missing rows using complete record matching
function compareDataSets(app1Data, app2Data) {
  if (!app1Data || !app2Data || app1Data.length === 0 || app2Data.length === 0) {
    return {
      mismatches: [{
        Row: "Dataset",
        Column: "N/A",
        App1: app1Data ? `${app1Data.length} rows` : "No data",
        App2: app2Data ? `${app2Data.length} rows` : "No data",
        Issue: "Missing or empty dataset",
        App1Data: "N/A",
        App2Data: "N/A"
      }],
      summary: { totalMismatches: 1, duplicatesApp1: 0, duplicatesApp2: 0, missingInApp1: 0, missingInApp2: 0 }
    };
  }

  let mismatches = [];
  let summary = {
    totalMismatches: 0,
    duplicatesApp1: 0,
    duplicatesApp2: 0,
    missingInApp1: 0,
    missingInApp2: 0,
    valueMismatches: 0,
    headerMismatches: 0
  };

  const headers1 = app1Data[0] || [];
  const headers2 = app2Data[0] || [];
  const dataRows1 = app1Data.slice(1);
  const dataRows2 = app2Data.slice(1);

  // 1. Header comparison
  if (headers1.length !== headers2.length) {
    mismatches.push({
      Row: "Headers",
      Column: "Count",
      App1: `${headers1.length} columns`,
      App2: `${headers2.length} columns`,
      Issue: "Different column count",
      App1Data: headers1.join(" | "),
      App2Data: headers2.join(" | ")
    });
    summary.headerMismatches++;
  }

  const maxHeaderCols = Math.max(headers1.length, headers2.length);
  for (let j = 0; j < maxHeaderCols; j++) {
    const h1 = headers1[j] || "";
    const h2 = headers2[j] || "";
    if (h1 !== h2) {
      mismatches.push({
        Row: "Headers",
        Column: j + 1,
        App1: h1 || "N/A",
        App2: h2 || "N/A",
        Issue: "Header mismatch",
        App1Data: h1 || "N/A",
        App2Data: h2 || "N/A"
      });
      summary.headerMismatches++;
    }
  }

  // 2. Create frequency maps using COMPLETE row data as key
  const frequencyMap1 = new Map();
  const frequencyMap2 = new Map();
  
  dataRows1.forEach((row, index) => {
    const key = createCompleteRowKey(row);
    if (!frequencyMap1.has(key)) {
      frequencyMap1.set(key, { count: 0, rows: [], indices: [] });
    }
    frequencyMap1.get(key).count++;
    frequencyMap1.get(key).rows.push(row);
    frequencyMap1.get(key).indices.push(index + 2); // +2 for header and 1-based indexing
  });

  dataRows2.forEach((row, index) => {
    const key = createCompleteRowKey(row);
    if (!frequencyMap2.has(key)) {
      frequencyMap2.set(key, { count: 0, rows: [], indices: [] });
    }
    frequencyMap2.get(key).count++;
    frequencyMap2.get(key).rows.push(row);
    frequencyMap2.get(key).indices.push(index + 2);
  });

  // 3. Identify duplicates
  frequencyMap1.forEach((data, key) => {
    if (data.count > 1) {
      summary.duplicatesApp1 += data.count - 1;
      const rowDisplay = formatRowForDisplay(data.rows[0], headers1);
      mismatches.push({
        Row: data.indices.join(", "),
        Column: "Complete Row",
        App1: `${data.count} occurrences`,
        App2: frequencyMap2.has(key) ? `${frequencyMap2.get(key).count} occurrences` : "0 occurrences",
        Issue: `Duplicate row in App1 (appears ${data.count} times)`,
        App1Data: rowDisplay,
        App2Data: frequencyMap2.has(key) ? formatRowForDisplay(frequencyMap2.get(key).rows[0], headers2) : "Row not found"
      });
    }
  });

  frequencyMap2.forEach((data, key) => {
    if (data.count > 1) {
      summary.duplicatesApp2 += data.count - 1;
      if (!frequencyMap1.has(key) || frequencyMap1.get(key).count <= 1) {
        const rowDisplay = formatRowForDisplay(data.rows[0], headers2);
        mismatches.push({
          Row: data.indices.join(", "),
          Column: "Complete Row",
          App1: frequencyMap1.has(key) ? `${frequencyMap1.get(key).count} occurrences` : "0 occurrences",
          App2: `${data.count} occurrences`,
          Issue: `Duplicate row in App2 (appears ${data.count} times)`,
          App1Data: frequencyMap1.has(key) ? formatRowForDisplay(frequencyMap1.get(key).rows[0], headers1) : "Row not found",
          App2Data: rowDisplay
        });
      }
    }
  });

  // 4. Find missing rows and count mismatches
  const processedKeys = new Set();

  frequencyMap1.forEach((data1, key) => {
    if (processedKeys.has(key)) return;
    processedKeys.add(key);

    if (!frequencyMap2.has(key)) {
      summary.missingInApp2++;
      const rowDisplay = formatRowForDisplay(data1.rows[0], headers1);
      mismatches.push({
        Row: data1.indices.join(", "),
        Column: "Complete Row",
        App1: "Present",
        App2: "Missing",
        Issue: "Complete row missing in App2",
        App1Data: rowDisplay,
        App2Data: "N/A - Row not found in App2"
      });
    } else {
      const data2 = frequencyMap2.get(key);
      if (data1.count !== data2.count) {
        const rowDisplay1 = formatRowForDisplay(data1.rows[0], headers1);
        const rowDisplay2 = formatRowForDisplay(data2.rows[0], headers2);
        mismatches.push({
          Row: `App1: ${data1.indices.join(", ")} | App2: ${data2.indices.join(", ")}`,
          Column: "Complete Row",
          App1: `${data1.count} occurrences`,
          App2: `${data2.count} occurrences`,
          Issue: "Same row appears different number of times",
          App1Data: rowDisplay1,
          App2Data: rowDisplay2
        });
      }
    }
  });

  // 5. Rows in App2 but not in App1
  frequencyMap2.forEach((data2, key) => {
    if (!processedKeys.has(key) && !frequencyMap1.has(key)) {
      summary.missingInApp1++;
      const rowDisplay = formatRowForDisplay(data2.rows[0], headers2);
      mismatches.push({
        Row: data2.indices.join(", "),
        Column: "Complete Row",
        App1: "Missing",
        App2: "Present", 
        Issue: "Complete row missing in App1",
        App1Data: "N/A - Row not found in App1",
        App2Data: rowDisplay
      });
    }
  });

  summary.totalMismatches = mismatches.length;
  return { mismatches, summary };
}

describe("Transaction Data Comparison", () => {
  function extractTableData() {
    cy.get('[class="ant-space-item"] [type="button"]').eq(0).click();
    cy.get(":nth-child(3) > .ant-card > .ant-card-body > .ant-space")
      .should("contain.text", "Cards")
      .click();

    cy.get('[id="rc-tabs-0-tab-/cards/transaction-history"]')
      .should("contain.text", "Transaction History")
      .click();

    cy.wait(10000);
    cy.get(".ant-spin-dot").should("not.exist");
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    cy.get("table").then((table) => {
      const headers = [...table.find("thead th")].map((th) => clean(th.innerText));
      const rows = [...table.find("tbody tr")].map((tr) =>
        [...tr.querySelectorAll("td")].map((td) => clean(td.innerText))
      );
      const tableData = [headers, ...rows];
      cy.wrap(tableData).as('currentTableData');
    });
  }

  it("Fetch and compare transactions with complete row matching", () => {
    cy.viewport(1920, 1080);
    let app1Data, app2Data;

    // App1
    cy.visit("https://webapp06.volopa-dev.com");
    signin.Login(userName, password);
    extractTableData();
    
    cy.get('@currentTableData').then((data) => {
      app1Data = data;
      cy.task("saveCsv", { data: app1Data, filename: "app1.csv" });
    });

    // App2
    cy.origin(
      "https://webapp07.volopa-dev.com",
      { args: { userName, password } },
      ({ userName, password }) => {
        function cleanLocal(val) {
          if (!val) return "";
          return val
            .replace(/\u00A0/g, " ")
            .replace(/\s+/g, " ")
            .replace(/[\r\n\t]/g, " ")
            .trim()
            .toLowerCase();
        }

        cy.visit("/");
        cy.get("#username").type(userName);
        cy.get("#password").type(password);
        cy.get('button[type="submit"]').click();

        cy.get('[class="ant-space-item"] [type="button"]').eq(0).click();
        cy.get(":nth-child(3) > .ant-card > .ant-card-body > .ant-space")
          .should("contain.text", "Cards")
          .click();

        cy.get('[id="rc-tabs-0-tab-/cards/transaction-history"]')
          .should("contain.text", "Transaction History")
          .click();

        cy.wait(10000);
        cy.get(".ant-spin-dot").should("not.exist");
        cy.get("table tbody tr").should("have.length.greaterThan", 0);

        cy.get("table").then((table) => {
          const headers = [...table.find("thead th")].map((th) =>
            cleanLocal(th.innerText)
          );
          const rows = [...table.find("tbody tr")].map((tr) =>
            [...tr.querySelectorAll("td")].map((td) => cleanLocal(td.innerText))
          );
          const data2 = [headers, ...rows];
          cy.task("saveCsv", { data: data2, filename: "app2.csv" });
          cy.task("saveCsv", { data: data2, filename: "temp_app2_data.csv" });
        });
      }
    );

    // Compare
    // Compare
cy.then(() => {
  cy.task("readCsv", "temp_app2_data.csv").then((app2CsvData) => {
    app2Data = app2CsvData;
    
    const { mismatches, summary } = compareDataSets(app1Data, app2Data);

    // Build HTML table
    let html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Transaction Comparison Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background: #333; color: #fff; }
            .mismatch { background-color: #ffcccc; }  /* red */
            .header-mismatch { background-color: #fff3cd; } /* yellow */
            .duplicate { background-color: #d1e7dd; } /* green */
            .missing { background-color: #e2e3e5; } /* gray */
          </style>
        </head>
        <body>
          <h2>Transaction Comparison Report</h2>
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Column</th>
                <th>App1</th>
                <th>App2</th>
                <th>Issue</th>
                <th>App1 Data</th>
                <th>App2 Data</th>
              </tr>
            </thead>
            <tbody>
    `;

    mismatches.forEach(m => {
      let cssClass = "mismatch";
      if (m.Issue.includes("Header")) cssClass = "header-mismatch";
      if (m.Issue.includes("Duplicate")) cssClass = "duplicate";
      if (m.Issue.includes("Missing")) cssClass = "missing";

      html += `
        <tr class="${cssClass}">
          <td>${m.Row}</td>
          <td>${m.Column}</td>
          <td>${m.App1}</td>
          <td>${m.App2}</td>
          <td>${m.Issue}</td>
          <td>${m.App1Data}</td>
          <td>${m.App2Data}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <h3>Summary</h3>
          <ul>
            <li>Total Mismatches: ${summary.totalMismatches}</li>
            <li>Header Mismatches: ${summary.headerMismatches}</li>
            <li>Duplicates in App1: ${summary.duplicatesApp1}</li>
            <li>Duplicates in App2: ${summary.duplicatesApp2}</li>
            <li>Missing in App1: ${summary.missingInApp1}</li>
            <li>Missing in App2: ${summary.missingInApp2}</li>
          </ul>
        </body>
      </html>
    `;

    // Save as HTML instead of CSV
    cy.task("saveFile", {
      filename: "comparison_report.html",
      content: html
    });

    if (summary.totalMismatches === 0) {
      cy.log("✅ Perfect match! No mismatches found");
    } else {
      cy.log(`⚠️ Found ${summary.totalMismatches} mismatches`);
    }
  });
});
  })
});
