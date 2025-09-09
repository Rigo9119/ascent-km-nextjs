import DOMPurify from 'isomorphic-dompurify';

// Configuration for different types of content
const sanitizeConfigs = {
  // For user-generated content that should allow basic formatting
  userContent: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'blockquote'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  // For content that should be completely stripped of HTML
  plainText: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  // For titles and short text that should not contain any HTML
  title: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(content: string, type: 'userContent' | 'plainText' | 'title' = 'userContent'): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const config = sanitizeConfigs[type];
  return DOMPurify.sanitize(content.trim(), config);
}

/**
 * Sanitizes user input for discussions, comments, etc.
 * Allows basic formatting but removes dangerous HTML
 */
export function sanitizeUserContent(content: string): string {
  return sanitizeHtml(content, 'userContent');
}

/**
 * Sanitizes content to plain text only (no HTML allowed)
 * Useful for titles, usernames, etc.
 */
export function sanitizeToPlainText(content: string): string {
  return sanitizeHtml(content, 'plainText');
}

/**
 * Sanitizes titles and other single-line content
 */
export function sanitizeTitle(content: string): string {
  return sanitizeHtml(content, 'title');
}

/**
 * Additional validation for URL inputs
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  
  // Basic URL validation - must start with http:// or https://
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return null;
  }

  try {
    const urlObj = new URL(trimmed);
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
}

/**
 * Validates and sanitizes email addresses
 */
export function sanitizeEmail(email: string): string | null {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const trimmed = email.trim().toLowerCase();
  
  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Sanitizes username input
 */
export function sanitizeUsername(username: string): string {
  if (!username || typeof username !== 'string') {
    return '';
  }

  // Remove any non-alphanumeric characters except underscores and hyphens
  return username.trim().replace(/[^a-zA-Z0-9_-]/g, '');
}