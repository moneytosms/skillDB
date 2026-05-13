import { GoogleGenAI } from '@google/genai';
import { Groq } from 'groq-sdk';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';

export async function extractProfileFromText(textContext: string, existingProfile?: any): Promise<any> {
  const { apiKeys, preferences } = useStore.getState();
  const provider = preferences.aiProvider || 'gemini';
  const model = preferences.aiModel || (provider === 'gemini' ? 'gemini-3.1-pro-preview' : 'llama-3.3-70b-versatile');

  let existingIndex = '';
  if (existingProfile) {
    existingIndex = `
  EXISTING PROFILE ENTRIES (DO NOT DUPLICATE THESE):
  - Experience: ${existingProfile.experience?.map((e: any) => `${e.role} at ${e.company}`).join(', ') || 'None'}
  - Education: ${existingProfile.education?.map((e: any) => `${e.degree} at ${e.institution}`).join(', ') || 'None'}
  - Projects: ${existingProfile.projects?.map((e: any) => e.name).join(', ') || 'None'}
  
  IMPORTANT INSTRUCTION ABOUT DUPLICATES:
  If a project, experience, or education item in the Raw Text matches or is a very similar variation of an item in the EXISTING PROFILE ENTRIES list above, DO NOT include it in your extraction. We are doing a merge, and we only want NEW items extracted.
    `;
  }

  const prompt = `
  You are an expert data extractor. An applicant has provided their resume or LinkedIn profile text. 
  Your goal is to parse this raw text and extract their detailed profile data into a strict JSON schema.
  ${existingIndex}

  Raw Text to Parse:
  """
  ${textContext}
  """

  Please generate EXACTLY the following JSON structure. Do not output anything other than valid JSON.
  Ensure arrays are used as specified. Fill in what you can find, and leave missing string fields as "" and arrays as [].

  {
    "personalInfo": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "website": "string",
      "linkedin": "string",
      "github": "string",
      "summary": "string"
    },
    "experience": [
      {
        "company": "string",
        "role": "string",
        "startDate": "string (e.g. Aug 2024)",
        "endDate": "string (e.g. Present or Apr 2028)",
        "current": boolean,
        "description": "string (bullet points concatenated with newlines)"
      }
    ],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": ["string", "string"],
        "link": "string"
      }
    ],
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "startDate": "string",
        "endDate": "string",
        "current": boolean
      }
    ],
    "skills": [
      {
        "category": "string (e.g. Programming, Frameworks, Tools)",
        "items": ["string", "string"]
      }
    ],
    "miscellaneous": [
      {
        "type": "string (e.g. Award, Certification, Volunteer, Language)",
        "title": "string",
        "subtitle": "string (e.g. Issuer, Organization)",
        "date": "string",
        "description": "string"
      }
    ]
  }
  `;

  const cleanJSON = (text: string) => {
    let cleaned = text.trim();
    if (cleaned.startsWith('\`\`\`json')) cleaned = cleaned.replace(/^\`\`\`json/, '');
    if (cleaned.startsWith('\`\`\`')) cleaned = cleaned.replace(/^\`\`\`/, '');
    if (cleaned.endsWith('\`\`\`')) cleaned = cleaned.replace(/\`\`\`$/, '');
    return cleaned.trim();
  };

  let jsonStr = '{}';

  try {
    if (provider === 'gemini') {
      let apiKey = apiKeys.gemini || process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('No Gemini API key found. Please add it in settings.');

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: "You are an expert extractor. Always structure the output in clean JSON. No markdown wrappers.",
          temperature: 0.1,
        }
      });
      jsonStr = cleanJSON(response.text || '{}');
    } else if (provider === 'groq') {
      let apiKey = apiKeys.groq;
      if (!apiKey) throw new Error('No Groq API key found. Please add it in settings.');

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert data extractor. Output only strict JSON." },
          { role: "user", content: prompt },
        ],
        model: model,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });
      jsonStr = cleanJSON(chatCompletion.choices[0]?.message?.content || '{}');
    } else if (provider === 'openai') {
      let apiKey = apiKeys.openai;
      if (!apiKey) throw new Error('No OpenAI API key found. Please add it in settings.');

      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert data extractor. Output only strict JSON." },
          { role: "user", content: prompt },
        ],
        model: model,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });
      jsonStr = cleanJSON(chatCompletion.choices[0]?.message?.content || '{}');
    } else if (provider === 'anthropic') {
      let apiKey = apiKeys.anthropic;
      if (!apiKey) throw new Error('No Anthropic API key found. Please add it in settings.');

      const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 4096,
        temperature: 0.1,
        system: "You are an expert data extractor. Output only strict JSON. Do not include any markdown formatting or explanations.",
        messages: [{ role: "user", content: prompt }]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        jsonStr = cleanJSON(content.text);
      }
    }
    
    // Parse the JSON and add IDs
    const parsed = JSON.parse(jsonStr);
    
    // add uuids
    if (parsed.experience) parsed.experience.forEach((e: any) => e.id = uuidv4());
    if (parsed.projects) parsed.projects.forEach((p: any) => p.id = uuidv4());
    if (parsed.education) parsed.education.forEach((e: any) => e.id = uuidv4());
    if (parsed.skills) parsed.skills.forEach((s: any) => s.id = uuidv4());
    if (parsed.miscellaneous) parsed.miscellaneous.forEach((m: any) => m.id = uuidv4());
    
    return parsed;
  } catch (error: any) {
    console.error('AI Extraction Error:', error);
    throw new Error(`Extraction failed: ${error.message}`);
  }
}

export async function generateJSONResume(jobDescription: string, profileContext: string): Promise<string> {
  const { apiKeys, preferences } = useStore.getState();
  const provider = preferences.aiProvider || 'gemini';
  const model = preferences.aiModel || (provider === 'gemini' ? 'gemini-3.1-pro-preview' : 'llama-3.3-70b-versatile');

  const prompt = `
  You are an expert resume writer and career coach. Your task is to generate a highly tailored, ATS-friendly resume based on the user's provided profile context and the target job description.
  
  Target Job Description:
  ${jobDescription}

  User Profile Context:
  ${profileContext}

  Please generate a polished, professional resume structured EXACTLY according to the following JSON schema. Do not output anything other than valid JSON. 
  
  CRITICAL: The generated resume MUST fit onto a single page. Be extremely concise. Select ONLY the most relevant 2-4 experiences, 2-3 projects, and keep bullet points punchy and impactful (maximum 3-4 bullets per role). Do not include filler words.
  
  {
    "personalInfo": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string",
      "github": "string",
      "website": "string"
    },
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "startDate": "string",
        "endDate": "string",
        "details": "string"
      }
    ],
    "experience": [
      {
        "company": "string",
        "role": "string",
        "startDate": "string",
        "endDate": "string",
        "description": ["bullet point 1", "bullet point 2"]
      }
    ],
    "projects": [
      {
        "name": "string",
        "link": "string (optional)",
        "description": "string",
        "technologies": ["string", "string"]
      }
    ],
    "skills": {
      "Programming": "string",
      "Web": "string",
      "Databases": "string",
      "Tools": "string"
    },
    "certifications": [
      {
        "name": "string",
        "issuer": "string",
        "link": "string"
      }
    ],
    "awards": ["award string 1", "award string 2"]
  }

  IMPORTANT: Extract and map the user's data into these fields. For 'skills' object, try to map their skills into categories like Programming, Web, Databases, Tools, etc. For experience descriptions, enhance their bullet points to emphasize impact related to the job description if possible. Extract applicable content from 'miscellaneous' into 'awards' and 'certifications'.
  `;

  const cleanJSON = (text: string) => {
    let cleaned = text.trim();
    if (cleaned.startsWith('\`\`\`json')) cleaned = cleaned.replace(/^\`\`\`json/, '');
    if (cleaned.startsWith('\`\`\`')) cleaned = cleaned.replace(/^\`\`\`/, '');
    if (cleaned.endsWith('\`\`\`')) cleaned = cleaned.replace(/\`\`\`$/, '');
    return cleaned.trim();
  };

  try {
    if (provider === 'gemini') {
      let apiKey = apiKeys.gemini || process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('No Gemini API key found. Please add it in settings.');

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: "You are an expert technical resume writer. Always structure the output in clean JSON. No markdown wrappers.",
          temperature: 0.3,
        }
      });

      return cleanJSON(response.text || '{}');
    } else if (provider === 'groq') {
      let apiKey = apiKeys.groq;
      if (!apiKey) throw new Error('No Groq API key found. Please add it in settings.');

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert technical resume writer. Output only strict JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: model,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      return chatCompletion.choices[0]?.message?.content || '{}';
    } else if (provider === 'openai') {
      let apiKey = apiKeys.openai;
      if (!apiKey) throw new Error('No OpenAI API key found. Please add it in settings.');

      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert technical resume writer. Output only strict JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: model,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      return chatCompletion.choices[0]?.message?.content || '{}';
    } else if (provider === 'anthropic') {
      let apiKey = apiKeys.anthropic;
      if (!apiKey) throw new Error('No Anthropic API key found. Please add it in settings.');

      const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 4096,
        temperature: 0.3,
        system: "You are an expert technical resume writer. Output only strict JSON. Do not include any markdown formatting or explanations.",
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return cleanJSON(content.text);
      }
      return '{}';
    }
  } catch (error: any) {
    console.error('AI Error:', error);
    const msg = error.message?.toLowerCase() || '';
    const status = error.status || error.response?.status;
    
    if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
      throw new Error(`Rate limit exceeded for ${provider.toUpperCase()}. Please wait a moment and try again.`);
    }
    if (status === 402 || status === 403 || msg.includes('quota') || msg.includes('insufficient_quota') || msg.includes('balance') || msg.includes('credit')) {
      throw new Error(`API quota or balance exceeded for ${provider.toUpperCase()}. Please check your billing details.`);
    }
    if (status === 401 || msg.includes('unauthorized') || msg.includes('invalid api key')) {
      throw new Error(`Invalid API Key for ${provider.toUpperCase()}. Please check your settings.`);
    }
    
    throw new Error(`Generation failed (${provider}): ${error.message || 'Unknown error'}`);
  }

  throw new Error('Invalid AI provider selected.');
}

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function chatWithCoach(messages: ChatMessage[], profileContext: string): Promise<string> {
  const { apiKeys, preferences } = useStore.getState();
  const provider = preferences.aiProvider || 'gemini';
  const model = preferences.aiModel || (provider === 'gemini' ? 'gemini-3.1-pro-preview' : 'llama-3.3-70b-versatile');

  const systemInstruction = `You are an expert career coach, recruiter, and interview prep assistant. 
You are helping the user prepare for job interviews based on their resume/profile context.
Be highly human, empathetic, concise, and provide the most effective "human-sounding" answers.
Help them articulate their experience in a compelling way.

User Profile Context:
${profileContext}
`;

  try {
    if (provider === 'gemini') {
      let apiKey = apiKeys.gemini || process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('No Gemini API key found. Please add it in settings.');

      const ai = new GoogleGenAI({ apiKey });
      
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return response.text || '';
    } else if (provider === 'groq') {
      let apiKey = apiKeys.groq;
      if (!apiKey) throw new Error('No Groq API key found. Please add it in settings.');

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      const apiMessages = [
        { role: "system", content: systemInstruction },
        ...messages
      ] as any;

      const chatCompletion = await groq.chat.completions.create({
        messages: apiMessages,
        model: model,
        temperature: 0.7,
      });
      return chatCompletion.choices[0]?.message?.content || '';
    } else if (provider === 'openai') {
      let apiKey = apiKeys.openai;
      if (!apiKey) throw new Error('No OpenAI API key found. Please add it in settings.');

      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const apiMessages = [
        { role: "system", content: systemInstruction },
        ...messages
      ] as any;

      const chatCompletion = await openai.chat.completions.create({
        messages: apiMessages,
        model: model,
        temperature: 0.7,
      });
      return chatCompletion.choices[0]?.message?.content || '';
    } else if (provider === 'anthropic') {
      let apiKey = apiKeys.anthropic;
      if (!apiKey) throw new Error('No Anthropic API key found. Please add it in settings.');

      const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const apiMessages = messages.map(m => ({
        role: m.role,
        content: m.content
      })) as any;

      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 4096,
        temperature: 0.7,
        system: systemInstruction,
        messages: apiMessages,
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      return '';
    }
  } catch (error: any) {
    console.error('Chat Error:', error);
    throw new Error(`Chat failed (${provider}): ${error.message || 'Unknown error'}`);
  }

  throw new Error('Invalid AI provider selected.');
}
