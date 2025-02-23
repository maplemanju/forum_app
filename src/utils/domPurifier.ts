import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// DOMPurify requires a window object, which we need to create in Node.js environment
const window = new JSDOM('').window
const purify = DOMPurify(window)

export const sanitizeAll = (content: string): string => {
  return purify.sanitize(content, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    ALLOW_DATA_ATTR: false, // Disable data attributes
    ALLOW_UNKNOWN_PROTOCOLS: false, // Disable unknown protocols
    USE_PROFILES: {
      html: false,
      svg: false,
      svgFilters: false,
      mathMl: false,
    },
    KEEP_CONTENT: false,
  })
}

export const sanitizeContent = (content: string): string => {
  return purify.sanitize(content, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    ALLOW_DATA_ATTR: false, // Disable data attributes
    ALLOW_UNKNOWN_PROTOCOLS: false, // Disable unknown protocols
    USE_PROFILES: {
      html: false,
      svg: false,
      svgFilters: false,
      mathMl: false,
    },
  })
}
