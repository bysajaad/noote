export type EnterAction =
  | { type: 'continue'; indent: string; nextMarker: string }
  | { type: 'exit'; indent: string }
  | { type: 'default' };

interface ListMarker {
  indent: string;
  markerEnd: number;
  nextMarker: string;
}

function matchListLine(lineText: string): ListMarker | undefined {
  // Todo checked before plain bullet — checkbox syntax is a bullet variant.
  let match = /^(\s*)([-*+]) \[[ xX]\] /.exec(lineText);
  if (match) {
    return { indent: match[1], markerEnd: match[0].length, nextMarker: `${match[2]} [ ] ` };
  }

  match = /^(\s*)([-*+]) /.exec(lineText);
  if (match) {
    return { indent: match[1], markerEnd: match[0].length, nextMarker: `${match[2]} ` };
  }

  match = /^(\s*)(\d+)([.)]) /.exec(lineText);
  if (match) {
    const next = String(Number(match[2]) + 1);
    return { indent: match[1], markerEnd: match[0].length, nextMarker: `${next}${match[3]} ` };
  }

  return undefined;
}

/**
 * Decides what pressing Enter should do on a given line: continue a list
 * with the next marker, exit an empty list item back to a plain paragraph
 * (the "double Enter" WYSIWYG-editor behavior), or fall back to a normal
 * newline for non-list lines.
 */
export function computeEnterAction(lineText: string): EnterAction {
  const marker = matchListLine(lineText);
  if (!marker) {
    return { type: 'default' };
  }

  const content = lineText.slice(marker.markerEnd);
  if (content.trim().length === 0) {
    return { type: 'exit', indent: marker.indent };
  }

  return { type: 'continue', indent: marker.indent, nextMarker: marker.nextMarker };
}
