# Changelog

## 0.0.3

- Updated extension icon.
- Pressing Enter in a Todo, Bulleted list, or Numbered list item now continues the list on the next line (numbered lists auto-increment; todos always start unchecked). Pressing Enter on an empty list item exits the list back to a plain paragraph instead, matching WYSIWYG editor behavior.

## 0.0.2

- Add extension icon.

## 0.0.1

- Initial slash command menu for markdown files: headings, title, todo, bulleted/numbered lists, strikethrough, underline, table, quote, code block, toggle block, divider, page break, link, image, date, and GFM callouts (note/tip/warning/important/caution).
- Trigger fires only at line start or after whitespace, and is suppressed inside fenced code blocks and inline code spans.
- `mdSlash.enabled`, `mdSlash.disabledCommands`, and `mdSlash.customSnippets` configuration.
