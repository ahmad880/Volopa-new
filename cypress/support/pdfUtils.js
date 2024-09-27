const pdf = require('pdf-parse');

const getPdfContent = async (dataBuffer) => {
    const data = await pdf(dataBuffer);
    return data.text;
};

module.exports = { getPdfContent };