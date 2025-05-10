import { type NextRequest, NextResponse } from "next/server"
import {
  processRequestHeaders,
  extractHeaderTokens,
  extractHeaderKeyValues,
  getAuthDetails,
  extractDataLexHeaders,
} from "@/lib/api-headers"

export async function GET(request: NextRequest) {
  // Process all headers according to their tokenization configuration
  const processedHeaders = processRequestHeaders(request.headers)

  // Extract specific headers
  const authTokens = extractHeaderTokens(request.headers, "authorization")
  const contentTypeTokens = extractHeaderTokens(request.headers, "content-type")
  const cookieKeyValues = extractHeaderKeyValues(request.headers, "cookie")

  // Get auth details
  const authDetails = getAuthDetails(request.headers)

  // Extract DataLex specific headers
  const dataLexHeaders = extractDataLexHeaders(request.headers)

  // Return the processed headers
  return NextResponse.json({
    allProcessedHeaders: processedHeaders,
    specificHeaders: {
      authorization: authTokens,
      contentType: contentTypeTokens,
      cookies: cookieKeyValues,
    },
    authDetails,
    dataLexHeaders,
  })
}
