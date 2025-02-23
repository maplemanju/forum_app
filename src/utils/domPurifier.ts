import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const initializeDOMPurify = (client: boolean = false) => {
  if (client) {
    return DOMPurify
  }
  // for server side
  const window = new JSDOM('').window
  return DOMPurify(window)
}

export const sanitizeAll = (
  content: string,
  client: boolean = false // if true, use the client side DOMPurify
): string => {
  const purifier = initializeDOMPurify(client)
  return purifier.sanitize(content, {
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

export const sanitizeContent = (
  content: string,
  client: boolean = false
): string => {
  const purifier = initializeDOMPurify(client)
  return purifier.sanitize(content, {
    ALLOWED_TAGS: ['u'], // Strip all HTML tags
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
