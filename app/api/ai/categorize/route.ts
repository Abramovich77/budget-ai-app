import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { categorizationSchema } from "@/lib/validation/schemas";
import { validateBody } from "@/lib/validation/validate";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/middleware/rateLimit";
import { logRequest, logResponse, logError } from "@/lib/middleware/logger";
import {
  withErrorHandler,
  successResponses,
  InternalServerError,
} from "@/lib/errors/apiErrors";

export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Standard categories for budgeting
const CATEGORIES = [
  "Groceries",
  "Dining Out",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Utilities",
  "Rent/Mortgage",
  "Insurance",
  "Education",
  "Personal Care",
  "Income",
  "Transfer",
  "Other",
];

export const POST = withErrorHandler(async (request: NextRequest) => {
  const startTime = Date.now();
  const requestId = logRequest(request);

  // Apply rate limiting for AI endpoint
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.ai);
  if (rateLimitResponse) {
    logResponse(requestId, 429, Date.now() - startTime);
    return rateLimitResponse;
  }

  // Validate and sanitize request body
  const validated = await validateBody(request, categorizationSchema);
  const { description, amount, merchant } = validated;

  try {

  // Call Claude API for categorization
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `You are a financial transaction categorizer. Categorize the following transaction into ONE of these categories: ${CATEGORIES.join(", ")}.

Transaction details:
- Description: ${description}
${amount !== undefined ? `- Amount: $${Math.abs(amount)}` : ""}
${merchant ? `- Merchant: ${merchant}` : ""}

Rules:
- If amount is positive, it's likely "Income"
- Be specific: use "Groceries" not "Shopping" for food stores
- Use "Dining Out" for restaurants, cafes, etc.
- Use "Transportation" for gas, uber, parking, etc.

Respond with ONLY the category name, nothing else.`,
      },
    ],
  });

  const categoryText = message.content[0].type === "text"
    ? message.content[0].text.trim()
    : "Other";

  // Validate that the response is one of our categories
  const category = CATEGORIES.includes(categoryText) ? categoryText : "Other";

  // Calculate confidence based on Claude's response
  // In a real implementation, we'd use Claude's confidence scores
  const confidence = categoryText === "Other" ? 0.5 : 0.95;

  const response = successResponses.ok({
    category,
    confidence,
    alternatives: [], // TODO: Implement alternative suggestions
  });

  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.ai);
  for (const [key, value] of Object.entries(rateLimitHeaders)) {
    response.headers.set(key, value);
  }

  // Add request ID header
  response.headers.set("X-Request-Id", requestId);

  // Log response
  logResponse(requestId, response.status, Date.now() - startTime);

  return response;
  } catch (error) {
    // Log AI-specific error
    logError(request, error as Error, { requestId });
    console.error("AI categorization error:", error);

    // Fallback to rule-based categorization
    const fallbackCategory = amount !== undefined
      ? getFallbackCategory(description, amount)
      : "Other";

    const response = successResponses.ok({
      category: fallbackCategory,
      confidence: 0.5,
      alternatives: [],
      note: "AI unavailable, used rule-based categorization",
    });

    // Add rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.ai);
    for (const [key, value] of Object.entries(rateLimitHeaders)) {
      response.headers.set(key, value);
    }

    response.headers.set("X-Request-Id", requestId);
    logResponse(requestId, response.status, Date.now() - startTime);

    return response;
  }
});

// Simple rule-based fallback categorization
function getFallbackCategory(description: string, amount: number): string {
  const desc = description.toLowerCase();

  if (amount > 0) return "Income";

  if (desc.includes("grocery") || desc.includes("whole foods") || desc.includes("safeway")) {
    return "Groceries";
  }
  if (desc.includes("restaurant") || desc.includes("cafe") || desc.includes("starbucks")) {
    return "Dining Out";
  }
  if (desc.includes("gas") || desc.includes("uber") || desc.includes("lyft") || desc.includes("shell")) {
    return "Transportation";
  }
  if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("movie")) {
    return "Entertainment";
  }
  if (desc.includes("rent") || desc.includes("mortgage")) {
    return "Rent/Mortgage";
  }
  if (desc.includes("electric") || desc.includes("water") || desc.includes("internet")) {
    return "Utilities";
  }

  return "Other";
}
