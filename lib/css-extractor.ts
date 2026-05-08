// CSS Extractor utility functions

export interface Section {
  id: string;
  tag: string;
  preview: string;
}

export interface ExtractedResult {
  html: string;
  css: string;
  sections: Section[];
}

/**
 * Read a file and return its text content
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Detect sections with IDs from HTML content
 */
export function detectSections(html: string): Section[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections: Section[] = [];

  // Find all elements with id attribute
  const elementsWithId = doc.querySelectorAll('[id]');
  
  elementsWithId.forEach((el) => {
    const id = el.getAttribute('id');
    if (id) {
      // Get a preview of the content (first 50 chars of text)
      const textContent = el.textContent?.trim().slice(0, 50) || '';
      sections.push({
        id,
        tag: el.tagName.toLowerCase(),
        preview: textContent + (textContent.length >= 50 ? '...' : ''),
      });
    }
  });

  return sections;
}

/**
 * Extract CSS rules that match given class names
 */
export function extractCSSForClasses(cssText: string, classNames: string[]): string {
  const targets = classNames
    .map((c) => c.trim().replace(/^\./, ''))
    .filter(Boolean);

  if (!targets.length) return '';

  // Build a regex that matches any of the target class names as a CSS class
  const escapedNames = targets.map((n) =>
    n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const classPattern = new RegExp(
    `(?<![\\w-])\\.(${escapedNames.join('|')})(?![\\w-])`
  );

  const result: string[] = [];
  let i = 0;
  const len = cssText.length;

  // Helper: skip whitespace
  const skipWS = () => {
    while (i < len && /\s/.test(cssText[i])) i++;
  };

  // Helper: read until matching closing brace (handles nesting)
  const readBlock = (): string => {
    let depth = 0;
    const start = i;
    while (i < len) {
      if (cssText[i] === '{') depth++;
      else if (cssText[i] === '}') {
        depth--;
        if (depth === 0) {
          i++;
          return cssText.slice(start, i);
        }
      }
      i++;
    }
    return cssText.slice(start, i);
  };

  // Helper: read selector (up to opening brace)
  const readSelector = (): string => {
    const start = i;
    while (i < len && cssText[i] !== '{' && cssText[i] !== '}') i++;
    return cssText.slice(start, i).trim();
  };

  while (i < len) {
    skipWS();
    if (i >= len) break;

    // Comments
    if (cssText[i] === '/' && cssText[i + 1] === '*') {
      let end = cssText.indexOf('*/', i + 2);
      if (end === -1) end = len - 2;
      i = end + 2;
      continue;
    }

    // @ rules (media, supports, keyframes, layer, container, etc.)
    if (cssText[i] === '@') {
      const selector = readSelector();
      skipWS();
      if (i >= len) break;

      // @keyframes, @font-face, @charset, @import – no nested rules with class selectors
      if (/^@(keyframes|font-face|charset|import|namespace)/i.test(selector)) {
        if (cssText[i] === '{') {
          readBlock();
        } else {
          // single-line like @import
          while (i < len && cssText[i] !== ';') i++;
          i++;
        }
        continue;
      }

      // @media, @supports, @container, @layer with block
      if (cssText[i] === '{') {
        i++; // move past {
        // Collect inner rules that match our classes
        const innerRules: string[] = [];
        while (i < len) {
          skipWS();
          if (cssText[i] === '}') {
            i++;
            break;
          }
          if (cssText[i] === '/' && cssText[i + 1] === '*') {
            let end = cssText.indexOf('*/', i + 2);
            if (end === -1) end = len - 2;
            i = end + 2;
            continue;
          }
          const innerSel = readSelector();
          skipWS();
          if (i >= len || cssText[i] !== '{') {
            // malformed, skip
            while (i < len && cssText[i] !== '}' && cssText[i] !== '{') i++;
            continue;
          }
          const innerBlock = readBlock();
          if (classPattern.test(innerSel)) {
            innerRules.push(`  ${innerSel} ${innerBlock.trimEnd()}`);
          }
        }
        if (innerRules.length) {
          result.push(`${selector} {\n${innerRules.join('\n')}\n}`);
        }
      }
      continue;
    }

    // Regular rule
    const selector = readSelector();
    skipWS();
    if (i >= len) break;
    if (cssText[i] !== '{') {
      // malformed, skip char
      i++;
      continue;
    }
    const block = readBlock();
    if (classPattern.test(selector)) {
      result.push(`${selector} ${block.trimEnd()}`);
    }
  }

  return result.join('\n\n');
}

/**
 * Filter CSS to only include rules used by the HTML
 */
export function filterCSS(css: string, html: string): string {
  // Extract all class names from HTML
  const classMatches = html.match(/class=["']([^"']+)["']/gi) || [];
  const classNames = new Set<string>();
  
  classMatches.forEach((match) => {
    const classes = match.replace(/class=["']/i, '').replace(/["']$/, '');
    classes.split(/\s+/).forEach((c) => {
      if (c.trim()) classNames.add(c.trim());
    });
  });

  if (classNames.size === 0) return css;

  return extractCSSForClasses(css, Array.from(classNames));
}

/**
 * Extract a section by ID from HTML
 */
export function extractSection(html: string, sectionId: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const section = doc.getElementById(sectionId);
  
  if (!section) return '';
  
  return section.outerHTML;
}

/**
 * Generate complete output HTML with extracted section and filtered CSS
 */
export function generateOutputHTML(
  sectionHtml: string,
  filteredCss: string,
  originalHtml: string
): string {
  // Try to extract head content (styles, meta, etc.)
  const headMatch = originalHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : '';
  
  // Extract existing style tags
  const styleMatches = headContent.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extracted Section</title>
  ${styleMatches.join('\n  ')}
  <style>
${filteredCss}
  </style>
</head>
<body>
${sectionHtml}
</body>
</html>`;
}

/**
 * Format HTML with proper indentation
 */
export function formatHTML(html: string): string {
  let formatted = '';
  let indent = 0;
  const lines = html.split(/>\s*</);
  
  lines.forEach((line, index) => {
    // Add back the brackets
    if (index > 0) line = '<' + line;
    if (index < lines.length - 1) line = line + '>';
    
    // Check if this is a closing tag
    const isClosing = line.match(/^<\/\w/);
    const isSelfClosing = line.match(/\/>$/);
    const isOpening = line.match(/^<\w/) && !isSelfClosing;
    
    if (isClosing) indent = Math.max(0, indent - 1);
    
    formatted += '  '.repeat(indent) + line.trim() + '\n';
    
    if (isOpening && !isClosing) indent++;
  });
  
  return formatted.trim();
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Download text as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse class names from input string
 */
export function parseClassNames(input: string): string[] {
  return input
    .split(/[\s,\n]+/)
    .map((c) => c.trim().replace(/^\./, ''))
    .filter(Boolean);
}
