/**
 * Header Tokenization Configuration
 *
 * This utility allows configuring how different HTTP headers are tokenized
 * and processed within the AU-Legis-Compliant Framework.
 */

export type TokenizationStrategy = "simple" | "csv" | "json" | "jwt" | "custom"

export interface TokenizationRule {
  delimiter?: string
  keyValueSeparator?: string
  preserveQuotes?: boolean
  trimValues?: boolean
  ignoreEmpty?: boolean
  maxTokens?: number
  customParser?: (value: string) => string[]
}

export interface HeaderTokenizationConfig {
  strategy: TokenizationStrategy
  rules: TokenizationRule
}

// Default tokenization configurations for common headers
const defaultTokenizationConfigs: Record<string, HeaderTokenizationConfig> = {
  authorization: {
    strategy: "simple",
    rules: {
      delimiter: " ",
      trimValues: true,
      ignoreEmpty: true,
    },
  },
  "content-type": {
    strategy: "simple",
    rules: {
      delimiter: ";",
      trimValues: true,
    },
  },
  accept: {
    strategy: "csv",
    rules: {
      delimiter: ",",
      trimValues: true,
    },
  },
  cookie: {
    strategy: "simple",
    rules: {
      delimiter: ";",
      keyValueSeparator: "=",
      trimValues: true,
    },
  },
  "x-datalex-token": {
    strategy: "jwt",
    rules: {
      delimiter: ".",
    },
  },
}

// Store custom configurations
const customTokenizationConfigs: Record<string, HeaderTokenizationConfig> = {}

/**
 * Set tokenization configuration for a specific header
 */
export function setHeaderTokenizationConfig(headerName: string, config: HeaderTokenizationConfig): void {
  customTokenizationConfigs[headerName.toLowerCase()] = config
}

/**
 * Get tokenization configuration for a specific header
 */
export function getHeaderTokenizationConfig(headerName: string): HeaderTokenizationConfig {
  const normalizedName = headerName.toLowerCase()
  return (
    customTokenizationConfigs[normalizedName] ||
    defaultTokenizationConfigs[normalizedName] || {
      strategy: "simple",
      rules: {
        delimiter: ",",
        trimValues: true,
      },
    }
  )
}

/**
 * Tokenize a header value based on its configuration
 */
export function tokenizeHeader(headerName: string, headerValue: string): string[] {
  const config = getHeaderTokenizationConfig(headerName)

  switch (config.strategy) {
    case "simple":
      return tokenizeSimple(headerValue, config.rules)
    case "csv":
      return tokenizeCSV(headerValue, config.rules)
    case "json":
      return tokenizeJSON(headerValue)
    case "jwt":
      return tokenizeJWT(headerValue)
    case "custom":
      return config.rules.customParser ? config.rules.customParser(headerValue) : [headerValue]
    default:
      return [headerValue]
  }
}

/**
 * Simple tokenization based on a delimiter
 */
function tokenizeSimple(value: string, rules: TokenizationRule): string[] {
  if (!value) return []

  const delimiter = rules.delimiter || ","
  let tokens = value.split(delimiter)

  if (rules.trimValues) {
    tokens = tokens.map((token) => token.trim())
  }

  if (rules.ignoreEmpty) {
    tokens = tokens.filter((token) => token.length > 0)
  }

  if (rules.maxTokens && tokens.length > rules.maxTokens) {
    tokens = tokens.slice(0, rules.maxTokens)
  }

  return tokens
}

/**
 * CSV tokenization with handling for quoted values
 */
function tokenizeCSV(value: string, rules: TokenizationRule): string[] {
  if (!value) return []

  const delimiter = rules.delimiter || ","
  const tokens: string[] = []
  let currentToken = ""
  let inQuotes = false

  for (let i = 0; i < value.length; i++) {
    const char = value[i]

    if (char === '"') {
      inQuotes = !inQuotes
      if (rules.preserveQuotes) {
        currentToken += char
      }
    } else if (char === delimiter && !inQuotes) {
      tokens.push(rules.trimValues ? currentToken.trim() : currentToken)
      currentToken = ""
    } else {
      currentToken += char
    }
  }

  // Add the last token
  tokens.push(rules.trimValues ? currentToken.trim() : currentToken)

  if (rules.ignoreEmpty) {
    return tokens.filter((token) => token.length > 0)
  }

  return tokens
}

/**
 * JSON tokenization
 */
function tokenizeJSON(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
    } else if (typeof parsed === "object" && parsed !== null) {
      return Object.entries(parsed).map(([key, val]) => `${key}:${typeof val === "string" ? val : JSON.stringify(val)}`)
    }
    return [value]
  } catch (e) {
    console.error("Error parsing JSON header:", e)
    return [value]
  }
}

/**
 * JWT tokenization
 */
function tokenizeJWT(value: string): string[] {
  return value.split(".")
}

/**
 * Parse a tokenized header into key-value pairs
 */
export function parseHeaderKeyValuePairs(headerName: string, headerValue: string): Record<string, string> {
  const config = getHeaderTokenizationConfig(headerName)
  const tokens = tokenizeHeader(headerName, headerValue)
  const result: Record<string, string> = {}

  if (!config.rules.keyValueSeparator) {
    // If no separator is defined, just return tokens as numbered keys
    tokens.forEach((token, index) => {
      result[index.toString()] = token
    })
    return result
  }

  tokens.forEach((token) => {
    const separatorIndex = token.indexOf(config.rules.keyValueSeparator!)
    if (separatorIndex !== -1) {
      const key = token.substring(0, separatorIndex).trim()
      const value = token.substring(separatorIndex + 1).trim()
      result[key] = value
    } else {
      // If token doesn't contain separator, use the token as both key and value
      result[token] = token
    }
  })

  return result
}
