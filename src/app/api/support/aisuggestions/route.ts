import { NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface RequestBody {
  message?: string;
  role?: string;
  targetRole?: string;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { message, role, targetRole } = body;

    if (!message || !role || !targetRole) {
      return NextResponse.json({ suggestions: [] });
    }

    /* ================= ROLE CONTEXT ================= */

    let roleContext = "";

    if (role === "user" && targetRole === "vendor") {
      roleContext = `
You are replying as a USER.
You are asking a vendor for help.
Explain the issue clearly and politely.
`;
    }

    if (role === "vendor" && targetRole === "user") {
      roleContext = `
You are replying as a VENDOR.
Help the user resolve their issue professionally.
`;
    }

    if (role === "vendor" && targetRole === "admin") {
      roleContext = `
You are replying as a VENDOR.
Explain the problem clearly and ask admin for guidance.
`;
    }

    if (role === "admin" && targetRole === "vendor") {
      roleContext = `
You are replying as an ADMIN.
Either request missing information or provide a solution.
`;
    }

    // Fallback context if no match
    if (!roleContext) {
      roleContext = `
You are a support assistant.
Provide a helpful and professional response.
`;
    }

    /* ================= PROMPT ================= */

    const prompt = `
You are a professional support assistant.

${roleContext}

Last message received:
"${message}"

Generate 3 reply suggestions.

Rules:
- 5 to 10 words each
- Polite and professional
- One suggestion per line
- No bullets or numbering
`;

    /* ================= FALLBACK SUGGESTIONS ================= */
    
    const getFallbackSuggestions = (): string[] => {
      if (role === "user" && targetRole === "vendor") {
        return [
          "When will this be resolved?",
          "Please help me with this",
          "Thank you for your response"
        ];
      } else if (role === "vendor" && targetRole === "user") {
        return [
          "We are looking into this",
          "Please provide more details",
          "We apologize for the inconvenience"
        ];
      } else if (role === "vendor" && targetRole === "admin") {
        return [
          "Please guide on this matter",
          "Need clarification on this",
          "Request your assistance please"
        ];
      } else if (role === "admin" && targetRole === "vendor") {
        return [
          "Please provide required documents",
          "Issue has been resolved",
          "Contact support for further help"
        ];
      }
      return [
        "Thank you for reaching out",
        "We will get back to you soon",
        "Please provide more details"
      ];
    };

    /* ================= GEMINI URL CALL ================= */

    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    // If no API key, return fallback suggestions immediately
    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY is not set - using fallback suggestions");
      return NextResponse.json({ 
        suggestions: getFallbackSuggestions()
      });
    }

    const geminiResponse = await fetch(
      `${GEMINI_URL}?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      // Return fallback suggestions instead of empty array
      return NextResponse.json({ 
        suggestions: getFallbackSuggestions()
      });
    }

    const data = await geminiResponse.json();

    /* ================= TEXT EXTRACTION ================= */

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse suggestions - handle various response formats
    let suggestions: string[] = [];
    
    if (text) {
      suggestions = text
        .split("\n")
        .map((s: string) => s.trim().replace(/^[-*•]\s*/, ''))
        .filter((s: string) => s.length > 0 && s.length <= 100)
        .slice(0, 3);
    }

    // If no valid suggestions extracted, use fallback
    if (suggestions.length === 0) {
      console.warn("No suggestions from Gemini, using fallback");
      suggestions = getFallbackSuggestions();
    }

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error("Suggestion error:", error);
    // Return fallback suggestions on error
    return NextResponse.json({ 
      suggestions: [
        "Thank you for reaching out",
        "We will get back to you soon",
        "Please provide more details"
      ]
    });
  }
}

