const FENCE_RE = /^\s*(```+|~~~+)/;

/**
 * Whether a cursor at the start of `precedingLines.length` (i.e. after all of
 * `precedingLines`) sits inside an open fenced code block. Mismatched fence
 * markers (``` vs ~~~) do not close each other, per CommonMark.
 */
export function isInsideCodeFence(precedingLines: string[]): boolean {
  let openFence: string | null = null;
  for (const line of precedingLines) {
    const match = FENCE_RE.exec(line);
    if (!match) {
      continue;
    }
    const marker = match[1];
    if (openFence === null) {
      openFence = marker;
    } else if (marker[0] === openFence[0]) {
      openFence = null;
    }
  }
  return openFence !== null;
}

/**
 * Whether the text up to the cursor on the current line leaves an inline
 * code span open. A code span only closes on a backtick run of the same
 * length as the one that opened it, per CommonMark.
 */
export function isInsideInlineCode(lineTextBeforeCursor: string): boolean {
  const runs = lineTextBeforeCursor.match(/`+/g);
  if (!runs) {
    return false;
  }
  let openLength: number | null = null;
  for (const run of runs) {
    if (openLength === null) {
      openLength = run.length;
    } else if (run.length === openLength) {
      openLength = null;
    }
  }
  return openLength !== null;
}
