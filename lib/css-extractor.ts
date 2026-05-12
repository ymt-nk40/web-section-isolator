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

function escapeRegExp(str: string): string {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitSelectors(selectorText: string): string[] {
  const selectors: string[] = [];
  let current = '';
  let quote: string | null = null;
  let paren = 0;
  let bracket = 0;

  for (let x = 0; x < selectorText.length; x++) {
    const ch = selectorText[x];
    const prev = selectorText[x - 1];

    if (quote) {
      current += ch;
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === '(') paren++;
    else if (ch === ')') paren = Math.max(0, paren - 1);
    else if (ch === '[') bracket++;
    else if (ch === ']') bracket = Math.max(0, bracket - 1);

    if (ch === ',' && paren === 0 && bracket === 0) {
      if (current.trim()) selectors.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim()) selectors.push(current.trim());
  return selectors;
}

function selectorHasTargetClass(selector: string, className: string): boolean {
  const cls = escapeRegExp(className);
  const re = new RegExp(`(^|[^\\w-])\\.${cls}(?![\\w-])`);
  return re.test(selector);
}

function extractTargetSelectors(selectorText: string, targetSet: Set<string>): string[] {
  const picked: string[] = [];

  for (const selector of splitSelectors(selectorText)) {
    for (const target of targetSet) {
      if (selectorHasTargetClass(selector, target)) {
        picked.push(selector);
        break;
      }
    }
  }

  return [...new Set(picked)];
}

/**
 * Extract CSS rules that match given class names.
 *
 * This parser keeps matching selectors from grouped rules and supports nested
 * @media, @supports, @container, @layer, etc. blocks.
 */
export function extractCSSForClasses(cssText: string, classNames: string[]): string {
  const targetSet = new Set(
    classNames
      .map((t) => String(t || '').replace(/^\./, '').trim())
      .filter(Boolean)
  );

  if (!targetSet.size) return '';

  const result: string[] = [];
  let i = 0;
  const len = cssText.length;

  const skipWS = () => {
    while (i < len && /\s/.test(cssText[i])) i++;
  };

  const skipComment = (): boolean => {
    if (cssText[i] === '/' && cssText[i + 1] === '*') {
      let end = cssText.indexOf('*/', i + 2);
      if (end < 0) end = len - 2;
      i = end + 2;
      return true;
    }
    return false;
  };

  const readUntilBlockStartOrEnd = (): string => {
    const start = i;
    let quote: string | null = null;
    let paren = 0;
    let bracket = 0;

    while (i < len) {
      const ch = cssText[i];
      const prev = cssText[i - 1];

      if (quote) {
        i++;
        if (ch === quote && prev !== '\\') quote = null;
        continue;
      }

      if (ch === '"' || ch === "'") {
        quote = ch;
        i++;
        continue;
      }

      if (ch === '(') paren++;
      else if (ch === ')') paren = Math.max(0, paren - 1);
      else if (ch === '[') bracket++;
      else if (ch === ']') bracket = Math.max(0, bracket - 1);

      if ((ch === '{' || ch === '}' || ch === ';') && paren === 0 && bracket === 0) break;
      i++;
    }

    return cssText.slice(start, i).trim();
  };

  const readBlock = (): string => {
    let depth = 0;
    const start = i;
    let quote: string | null = null;

    while (i < len) {
      const ch = cssText[i];
      const prev = cssText[i - 1];

      if (quote) {
        i++;
        if (ch === quote && prev !== '\\') quote = null;
        continue;
      }

      if (ch === '"' || ch === "'") {
        quote = ch;
        i++;
        continue;
      }

      if (ch === '/' && cssText[i + 1] === '*') {
        const end = cssText.indexOf('*/', i + 2);
        if (end < 0) {
          i = len;
          break;
        }
        i = end + 2;
        continue;
      }

      if (ch === '{') {
        depth++;
      } else if (ch === '}') {
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

  const buildRule = (selectorText: string, block: string): string => {
    const pickedSelectors = extractTargetSelectors(selectorText, targetSet);
    if (!pickedSelectors.length) return '';
    return `${pickedSelectors.join(',\n')} ${block.trimEnd()}`;
  };

  const parseRulesUntilClosingBrace = (): string[] => {
    const collected: string[] = [];

    while (i < len) {
      skipWS();
      while (skipComment()) skipWS();

      if (i >= len) break;
      if (cssText[i] === '}') {
        i++;
        break;
      }

      if (cssText[i] === '@') {
        const atRule = readUntilBlockStartOrEnd();
        skipWS();

        if (!cssText[i]) break;
        if (cssText[i] === ';') {
          i++;
          continue;
        }

        const lower = atRule.toLowerCase();
        if (
          lower.startsWith('@keyframes') ||
          lower.startsWith('@font-face') ||
          lower.startsWith('@property') ||
          lower.startsWith('@page')
        ) {
          if (cssText[i] === '{') readBlock();
          continue;
        }

        if (cssText[i] === '{') {
          i++;
          const inner = parseRulesUntilClosingBrace();
          if (inner.length) {
            collected.push(
              `${atRule} {\n${inner
                .map((rule) => `  ${rule.replace(/\n/g, '\n  ')}`)
                .join('\n\n')}\n}`
            );
          }
        }
        continue;
      }

      const selectorText = readUntilBlockStartOrEnd();
      skipWS();

      if (!selectorText) {
        i++;
        continue;
      }

      if (cssText[i] !== '{') {
        i++;
        continue;
      }

      const block = readBlock();
      const rule = buildRule(selectorText, block);
      if (rule) collected.push(rule);
    }

    return collected;
  };

  while (i < len) {
    skipWS();
    while (skipComment()) skipWS();

    if (i >= len) break;

    if (cssText[i] === '@') {
      const atRule = readUntilBlockStartOrEnd();
      skipWS();

      if (!cssText[i]) break;
      if (cssText[i] === ';') {
        i++;
        continue;
      }

      const lower = atRule.toLowerCase();
      if (
        lower.startsWith('@keyframes') ||
        lower.startsWith('@font-face') ||
        lower.startsWith('@property') ||
        lower.startsWith('@page')
      ) {
        if (cssText[i] === '{') readBlock();
        continue;
      }

      if (cssText[i] === '{') {
        i++;
        const inner = parseRulesUntilClosingBrace();
        if (inner.length) {
          result.push(
            `${atRule} {\n${inner
              .map((rule) => `  ${rule.replace(/\n/g, '\n  ')}`)
              .join('\n\n')}\n}`
          );
        }
      }
      continue;
    }

    const selectorText = readUntilBlockStartOrEnd();
    skipWS();

    if (!selectorText) {
      i++;
      continue;
    }

    if (cssText[i] !== '{') {
      i++;
      continue;
    }

    const block = readBlock();
    const rule = buildRule(selectorText, block);
    if (rule) result.push(rule);
  }

  return result.join('\n\n');
}

/**
 * Parse class names from HTML, JSX, or a plain class list.
 */
export function parseClassNames(input: string): string[] {
  const value = String(input || '');
  const names = new Set<string>();

  const addClassToken = (token: string) => {
    const clean = String(token || '')
      .trim()
      .replace(/^\./, '')
      .replace(/^class(Name)?=/, '')
      .replace(/^["'`]+|["'`]+$/g, '')
      .replace(/[<>]/g, '');

    if (!clean) return;

    clean
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        const normalized = item.replace(/^\./, '').replace(/^["'`]+|["'`]+$/g, '');
        if (normalized && !normalized.includes('=')) names.add(normalized);
      });
  };

  const addClassList = (classValue: string | null) => {
    String(classValue || '')
      .split(/\s+/)
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach(addClassToken);
  };

  if (value.includes('<') && /class(Name)?\s*=/.test(value)) {
    try {
      const doc = new DOMParser().parseFromString(value, 'text/html');
      doc.querySelectorAll('[class]').forEach((el) => {
        addClassList(el.getAttribute('class'));
      });
    } catch (err) {
      console.warn('DOMParser class extraction failed:', err);
    }
  }

  let match: RegExpExecArray | null;

  const quotedClassRe = /\bclass\s*=\s*(['"`])([\s\S]*?)\1/g;
  while ((match = quotedClassRe.exec(value))) addClassList(match[2]);

  const unquotedClassRe = /\bclass\s*=\s*([^\s'"`>]+)/g;
  while ((match = unquotedClassRe.exec(value))) addClassList(match[1]);

  const quotedClassNameRe = /\bclassName\s*=\s*(['"`])([\s\S]*?)\1/g;
  while ((match = quotedClassNameRe.exec(value))) addClassList(match[2]);

  const jsxClassNameExprRe = /\bclassName\s*=\s*\{(['"`])([\s\S]*?)\1\}/g;
  while ((match = jsxClassNameExprRe.exec(value))) addClassList(match[2]);

  if (!names.size || !value.includes('<')) {
    value
      .replace(/<[^>]*>/g, ' ')
      .split(/[\s,\n]+/)
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach(addClassToken);
  }

  return [...names];
}

/**
 * Filter CSS to only include rules used by the HTML
 */
export function filterCSS(css: string, html: string): string {
  const classNames = parseClassNames(html);

  if (classNames.length === 0) return css;

  return extractCSSForClasses(css, classNames);
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
