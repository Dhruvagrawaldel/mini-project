import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInstagramReply({
  caption,
  comment,
  tone = "Friendly & Natural",
  goal = "Move user to DM",
}: {
  caption: string;
  comment: string;
  tone?: string;
  goal?: string;
}) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Efficient and high quality for short replies
      messages: [
        {
          role: "system",
          content: `You are an Instagram marketing assistant.

Your task is to generate engaging, human-like replies to comments on Instagram posts.

Rules:
- Keep replies short (1-2 lines)
- Be friendly and natural (not robotic)
- Encourage conversation
- If possible, move user to DM
- Do NOT sound like a bot
- Use emojis naturally`,
        },
        {
          role: "user",
          content: `Context:
Post Caption: ${caption}
User Comment: ${comment}
Brand Tone: ${tone}
Goal: ${goal}

Output:
Generate a reply to this comment.`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
}
