const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Volopa Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // ✅ Mochawesome reporter
      require('cypress-mochawesome-reporter/plugin')(on);

      on('task', {
        // ✅ Delete old CSVs
        deleteDownloads() {
          const dir = path.join(__dirname, 'cypress', 'downloads');
          if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(file => {
              if (file.endsWith('.csv')) {
                fs.unlinkSync(path.join(dir, file));
              }
            });
          }
          return null;
        },

        // ✅ Save CSV
        saveCsv({ data, filename }) {
          const dir = path.join(__dirname, 'cypress', 'reports');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const csv = Papa.unparse(data);
          const filePath = path.join(dir, filename);
          fs.writeFileSync(filePath, csv, 'utf8');
          return filePath;
        },

        // ✅ Read CSV
        readCsv(filename) {
          const filePath = path.join(__dirname, 'cypress', 'reports', filename);
          if (!fs.existsSync(filePath)) {
            throw new Error(`CSV not found: ${filePath}`);
          }
          const csvContent = fs.readFileSync(filePath, 'utf8');
          const parsed = Papa.parse(csvContent, { skipEmptyLines: true });
          return parsed.data;
        },

        // ✅ Save raw HTML file
        saveFile({ content, filename }) {
          const dir = path.join(__dirname, 'cypress', 'reports');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const filePath = path.join(dir, filename);
          fs.writeFileSync(filePath, content, 'utf8');
          return filePath;
        },

        // ✅ Compare only HTML table sections
        compareTables({ table1, table2 }) {
  const cheerio = require('cheerio'); // lazy load cheerio

  if (!table1 || !table2) {
    throw new Error(`compareTables requires { table1, table2 }, got: ${table1}, ${table2}`);
  }

  const $1 = cheerio.load(table1);
  const $2 = cheerio.load(table2);

  let differences = [];

  // Compare rows/cells one by one
  $1('tr').each((i, row1) => {
    const row2 = $2('tr').eq(i);
    if (!row2.length) {
      differences.push({
        path: `row[${i + 1}]`,
        app1: $1(row1).text().trim(),
        app2: '<missing>'
      });
      return;
    }

    $1(row1).find('td,th').each((j, cell1) => {
      const cell2 = row2.find('td,th').eq(j);
      const v1 = $1(cell1).text().trim();
      const v2 = cell2.text().trim();
      if (v1 !== v2) {
        differences.push({
          path: `row[${i + 1}].col[${j + 1}]`,
          app1: v1,
          app2: v2
        });
      }
    });
  });

  // Extra rows in App2
  $2('tr').each((i, row2) => {
    if (!$1('tr').eq(i).length) {
      differences.push({
        path: `row[${i + 1}]`,
        app1: '<missing>',
        app2: $2(row2).text().trim()
      });
    }
  });

  // ✅ Save CSV report
  const dir = path.join(__dirname, 'cypress', 'reports');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const reportPath = path.join(dir, 'table_mismatch_report.csv');
  const csv = Papa.unparse([
    ['Path', 'App1', 'App2'],
    ...differences.map(d => [d.path, d.app1, d.app2])
  ]);
  fs.writeFileSync(reportPath, csv, 'utf8');

  return {
    match: differences.length === 0,
    totalMismatches: differences.length,
    reportFile: reportPath
  };
}
      });

      return config;
    },
    retries: { runMode: 0, openMode: 0 },
    baseUrl: 'https://webapp01.volopa-dev.com/',
    pageLoadTimeout: 100000,
    defaultCommandTimeout: 50000,
    experimentalMemoryManagement: true,
    video: false,
  },
});
