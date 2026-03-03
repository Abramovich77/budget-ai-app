import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { categorizationSchema } from "@/lib/validation/schemas";
import { validateBody, errorResponse } from "@/lib/validation/validate";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/middleware/rateLimit";

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

export async function POST(request: NextRequest) {
  // Apply rate limiting for AI endpoint
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.ai);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Validate and sanitize request body
    const validated = await validateBody(request, categorizationSchema);
    const { description, amount, merchant } = validated;

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

    const response = NextResponse.json({
      category,
      confidence,
      alternatives: [], // TODO: Implement alternative suggestions
    });

    // Add rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.ai);
    for (const [key, value] of Object.entries(rateLimitHeaders)) {
      response.headers.set(key, value);
    }

    return response;
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("AI categorization error:", error);

    // Fallback to "Other" category if AI fails
    return NextResponse.json({
      category: "Other",
      confidence: 0.5,
      alternatives: [],
      note: "AI unavailable, please categorize manually",
    });
  }
}

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
