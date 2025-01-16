// Finds the nearest full stop after the approximate split index
function findSplitIndex(story, startApproxIndex) {
  let index = story.indexOf('.', startApproxIndex);
  return index !== -1 ? index + 1 : startApproxIndex;
}

// Creates a cover image prompt from a story
function createCoverImagePrompt(story) {
  const endIndex = findSplitIndex(story, 150);
  return story.substring(0, endIndex) + "...";
}

// Retrieves the next unused image URL from the chat log
function getNextImageUrl(chatLog, usedImageUrls) {
  for (let entry of chatLog) {
      if (entry.message.startsWith('Image URL: ') && !usedImageUrls.has(entry.message)) {
          usedImageUrls.add(entry.message);
          return entry.message.replace('Image URL: ', '');
      }
  }
  return null; 
}

function extractFlexibleTitle(storyText) {
  // Normalize line endings
  storyText = storyText.replace(/\r\n/g, "\n");

  // Attempt to match a quoted title that appears immediately after a specific intro or standalone
  const introPattern = /(?:discussion:|Certainly! Here's the full story based on our discussion:)\s*"([^"]+)"/i;
  const standaloneQuotePattern = /^"([^"]+)"/;
  
  // Check for an explicit "Title:" marker or quoted title following an introduction
  let titleMatch = storyText.match(introPattern) || storyText.match(standaloneQuotePattern);
  if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
  }

  // Check for an explicit "Title:" marker without introduction
  titleMatch = storyText.match(/^Title:\s*(.+)/i);
  if (titleMatch) {
      return titleMatch[1].trim();
  }

  // Fallback to using the first significant text as the title if no pattern matches
  let firstSignificantText = storyText.split(/[\n\.]/, 1)[0];
  return firstSignificantText.trim();
}

module.exports = {
  findSplitIndex,
  createCoverImagePrompt,
  getNextImageUrl,
  extractFlexibleTitle,
};
