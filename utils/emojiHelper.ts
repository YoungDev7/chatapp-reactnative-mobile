/**
 * Checks if a string contains only emojis (and whitespace)
 * @param text - The text to check
 * @returns true if the text contains only emojis
 */
export const isOnlyEmojis = (text: string): boolean => {
  const trimmedText = text.trim();
  
  // Remove all emojis and whitespace, if nothing remains, it was only emojis
  const emojiRegex = /[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Component}]/gu;
  const textWithoutEmojis = trimmedText.replace(emojiRegex, '').replace(/\s/g, '');
  
  return textWithoutEmojis.length === 0 && trimmedText.length > 0;
};

/**
 * Counts the number of emojis in a string
 * @param text - The text to count emojis in
 * @returns the number of emojis
 */
export const countEmojis = (text: string): number => {
  const emojiRegex = /[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
};

/**
 * Checks if a message should be displayed as a large emoji (only emojis, 3 or fewer)
 * @param text - The text to check
 * @returns true if the message should be displayed as a large emoji
 */
export const shouldDisplayAsLargeEmoji = (text: string): boolean => {
  if (!isOnlyEmojis(text)) {
    return false;
  }
  
  const emojiCount = countEmojis(text);
  return emojiCount > 0 && emojiCount <= 3;
};
