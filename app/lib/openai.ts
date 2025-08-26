import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateAIContent(prompt: string, agentType: string) {
  try {
    const systemPrompt = getSystemPrompt(agentType);
    
    // Add a timeout to the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 30000);
    });
    
    const apiPromise = openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });
    
    // Race between the API call and the timeout
    const completion = await Promise.race([apiPromise, timeoutPromise]) as any;

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error('No content generated');
    }

    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error('AI content generation error:', error);
    
    // Provide more specific error messages based on the error type
    if (error.message === 'Request timed out') {
      throw new Error('Generation timed out. Please try again.');
    } else if (error.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    } else if (error.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error('Failed to generate content. Please try again.');
    }
  }
}

function getSystemPrompt(agentType: string): string {
  switch (agentType) {
    case 'creative':
      return "You are a creative AI agent specialized in generating unique artistic content, stories, and creative ideas. Be imaginative and original.";
    case 'technical':
      return "You are a technical AI agent specialized in code, algorithms, and technical solutions. Provide precise and valuable technical insights.";
    case 'business':
      return "You are a business AI agent specialized in strategy, market analysis, and business insights. Provide actionable business intelligence.";
    case 'research':
      return "You are a research AI agent specialized in analysis, data interpretation, and comprehensive research. Provide thorough and well-researched content.";
    default:
      return "You are a helpful AI agent. Provide valuable and unique insights based on the user's request.";
  }
}
