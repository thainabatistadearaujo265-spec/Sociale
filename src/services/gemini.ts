import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async generatePost(theme: string, niche: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um post viral para redes sociais sobre o tema "${theme}" no nicho de "${niche}". 
      Retorne um JSON com: caption (legenda viral), hashtags (array de strings), emojis (string de emojis), visualIdea (sugestão de imagem/vídeo).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            emojis: { type: Type.STRING },
            visualIdea: { type: Type.STRING }
          },
          required: ["caption", "hashtags", "emojis", "visualIdea"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateVideoScript(theme: string, niche: string, duration: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um roteiro de vídeo curto (Reels/TikTok) de ${duration} sobre "${theme}" no nicho de "${niche}". 
      Retorne um JSON com: hook (gancho viral), script (roteiro completo), cta (chamada para ação).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            script: { type: Type.STRING },
            cta: { type: Type.STRING }
          },
          required: ["hook", "script", "cta"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateIdeas(niche: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere 10 ideias de posts, 10 ideias de vídeos e 10 ideias de stories virais para o nicho de "${niche}". 
      Retorne um JSON com: posts (array), videos (array), stories (array).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            posts: { type: Type.ARRAY, items: { type: Type.STRING } },
            videos: { type: Type.ARRAY, items: { type: Type.STRING } },
            stories: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["posts", "videos", "stories"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateBio(niche: string, details: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie uma biografia otimizada para Instagram no nicho de "${niche}" com base nestes detalhes: "${details}". 
      Use emojis e palavras estratégicas. Retorne um JSON com a propriedade "bio".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: { type: Type.STRING }
          },
          required: ["bio"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateHashtags(theme: string, niche: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere 30 hashtags virais para o tema "${theme}" no nicho de "${niche}". 
      Retorne um JSON com a propriedade "hashtags" (array de strings).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["hashtags"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateCalendar(niche: string, days: number) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie um planejamento de postagens de ${days} dias para o nicho de "${niche}". 
      Retorne um JSON com a propriedade "days" (array de objetos com day, type, topic).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  type: { type: Type.STRING },
                  topic: { type: Type.STRING }
                },
                required: ["day", "type", "topic"]
              }
            }
          },
          required: ["days"]
        }
      }
    });
    return JSON.parse(response.text);
  }
};
