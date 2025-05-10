import { tokenizeHeader, parseHeaderKeyValuePairs } from "./header-tokenization"

/**
 * Process request headers according to tokenization configuration
 */
export function processRequestHeaders(headers: Headers | Record<string, string>): Record<string, string[]> {
  const result: Record<string, string[]> = {}

  // Convert Headers object to entries if needed
  const entries = headers instanceof Headers ? Array.from(headers.entries()) : Object.entries(headers)

  for (const [name, value] of entries) {
    result[name] = tokenizeHeader(name, value)
  }

  return result
}

/**
 * Extract specific tokenized header values
 */
export function extractHeaderTokens(headers: Headers | Record<string, string>, headerName: string): string[] {
  if (!headerName) return []

  let headerValue: string | null = null

  if (headers instanceof Headers) {
    headerValue = headers.get(headerName)
  } else {
    headerValue = headers[headerName] || null
  }

  if (!headerValue) return []

  return tokenizeHeader(headerName, headerValue)
}

/**
 * Extract key-value pairs from a header
 */
export function extractHeaderKeyValues(
  headers: Headers | Record<string, string>,
  headerName: string,
): Record<string, string> {
  if (!headerName) return {}

  let headerValue: string | null = null

  if (headers instanceof Headers) {
    headerValue = headers.get(headerName)
  } else {
    headerValue = headers[headerName] || null
  }

  if (!headerValue) return {}

  return parseHeaderKeyValuePairs(headerName, headerValue)
}

/**
 * Get authorization details from headers
 */
export function getAuthDetails(headers: Headers | Record<string, string>): { type: string; credentials: string } {
  const authTokens = extractHeaderTokens(headers, "authorization")

  if (authTokens.length >= 2) {
    return {
      type: authTokens[0],
      credentials: authTokens[1],
    }
  }

  return {
    type: "",
    credentials: "",
  }
}

/**
 * Extract DataLex specific headers
 */
export function extractDataLexHeaders(headers: Headers | Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {}

  // Process DataLex token if present
  const dataLexToken = extractHeaderTokens(headers, "x-datalex-token")
  if (dataLexToken.length > 0) {
    result.token = dataLexToken[0]

    // If it's a JWT token with 3 parts
    if (dataLexToken.length === 3) {
      try {
        // Decode the payload (middle part)
        const payload = JSON.parse(atob(dataLexToken[1]))
        result.tokenPayload = payload
      } catch (e) {
        console.error("Error decoding DataLex token payload:", e)
      }
    }
  }

  // Extract other DataLex headers
  const dataLexHeaders = ["x-datalex-version", "x-datalex-application", "x-datalex-jurisdiction"]
  for (const header of dataLexHeaders) {
    const tokens = extractHeaderTokens(headers, header)
    if (tokens.length > 0) {
      result[header.replace("x-datalex-", "")] = tokens[0]
    }
  }

  return result
}
