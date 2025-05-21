const fs = require('fs');
const path = require('path');

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
      // Add Mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);

      // Task to delete downloaded CSVs from cypress/downloads
      on('task', {
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
        }
      });

      return config;
    },
    retries:{
      runMode: 0,
      openMode: 0
    },

    baseUrl: 'https://webapp01.volopa-dev.com/',
    pageLoadTimeout: 100000,
    defaultCommandTimeout: 50000,
    experimentalMemoryManagement: true,
    video: false, // set to true if you want videos
  },
});