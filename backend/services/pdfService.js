const { extractFlexibleTitle, findSplitIndex } = require('../utils/storyUtils');

function generatePDF(storyText) {
    const title = extractFlexibleTitle(storyText);
    const splitIndex = findSplitIndex(storyText, 200);

    console.log("Title:", title);
    console.log("First Split:", storyText.substring(0, splitIndex));
    // Proceed with PDF generation logic
}

module.exports = {
    generatePDF
};