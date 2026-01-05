import { JSDOM } from "jsdom";

/**
 * HTML Parser - Parses and sanitizes HTML content
 */

export interface ParsedContent {
  html: string;
  text: string;
  headings: Array<{ level: number; text: string }>;
  wordCount: number;
}

export function parseHTML(htmlString: string): ParsedContent {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Extract text content
  const text = document.body.textContent || "";

  // Extract headings
  const headings: Array<{ level: number; text: string }> = [];
  for (let i = 1; i <= 6; i++) {
    const headingElements = document.querySelectorAll(`h${i}`);
    headingElements.forEach((heading) => {
      headings.push({
        level: i,
        text: heading.textContent || "",
      });
    });
  }

  // Count words
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Sanitize HTML (basic sanitization)
  const sanitizedHTML = sanitizeHTML(htmlString);

  return {
    html: sanitizedHTML,
    text,
    headings,
    wordCount,
  };
}

function sanitizeHTML(html: string): string {
  // Basic sanitization - remove script tags and dangerous attributes
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/on\w+='[^']*'/g, "")
    .replace(/javascript:/gi, "");

  return sanitized;
}

export function htmlToPlainText(html: string): string {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent || "";
}
