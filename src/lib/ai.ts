import { GoogleGenAI } from '@google/genai';
import { Groq } from 'groq-sdk';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';

const cleanJSON = (text: string) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('\`\`\`json')) cleaned = cleaned.replace(/^\`\`\`json/, '');
  if (cleaned.startsWith('\`\`\`')) cleaned = cleaned.replace(/^\`\`\`/, '');
  if (cleaned.endsWith('\`\`\`')) cleaned = cleaned.replace(/\`\`\`$/, '');
  return cleaned.trim();
};

const executeWithRotation = async (providerName: string, keysString: string | undefined | null, operation: (key: string) => Promise<any>) => {
  let keys = (keysString || '').split(',').map(k => k.trim()).filter(k => k.length > 0);
  if (providerName === 'gemini' && keys.length === 0) {
     const envKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
     if (envKey) keys = envKey.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
  }
  
  if (keys.length === 0) throw new Error(`No ${providerName.toUpperCase()} API key found. Please add it in settings (comma-separated for rotation).`);
  
  // Shuffle the keys to balance load
  let availableKeys = [...keys].sort(() => Math.random() - 0.5);
  let lastError: any = null;

  for (const key of availableKeys) {
    try {
      return await operation(key);
    } catch (error: any) {
      lastError = error;
      const msg = error.message?.toLowerCase() || '';
      const status = error.status || error.response?.status;
      const isRateLimit = status === 429 || msg.includes('rate limit') || msg.includes('too many requests') || status === 402 || status === 403 || msg.includes('quota') || msg.includes('insufficient_quota') || msg.includes('balance') || msg.includes('credit');
      
      if (isRateLimit && availableKeys.length > 1) {
        console.warn(`[${providerName}] Key hits limit/quota, rotating to next key...`);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export async function extractProfileFromText(textContext: string, existingProfile?: any): Promise<any> {
  const { apiKeys, preferences } = useStore.getState();
  const provider = preferences.aiProvider || 'gemini';
  const model = preferences.aiModel || (provider === 'gemini' ? 'gemini-3.1-pro-preview' : 'llama-3.3-70b-versatile');

  let duplicateHints = '';
  if (existingProfile) {
    const cleanTokenize = (text: string) => {
      const stops = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'is', 'are']);
      return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t && !stops.has(t));
    };

    const getOverlapWeight = (tokens1: string[], tokens2: string[]) => {
      if (tokens1.length === 0 || tokens2.length === 0) return 0;
      const set2 = new Set(tokens2);
      let overlap = 0;
      for (const t of tokens1) {
        if (set2.has(t)) overlap++;
      }
      return overlap / Math.min(tokens1.length, tokens2.length);
    };

    // We tokenize sentences/chunks of the raw text to compare against existing items
    const rawChunks = textContext.split('\n').filter(Boolean);
    const likelyDuplicates: string[] = [];

    existingProfile.projects?.forEach((p: any) => {
      if (!p.name) return;
      const pTokens = cleanTokenize(p.name);
      const hasMatch = rawChunks.some(chunk => getOverlapWeight(cleanTokenize(chunk), pTokens) >= 0.8);
      if (hasMatch) {
        likelyDuplicates.push(`Project: ${p.name}`);
      }
    });

    existingProfile.experience?.forEach((e: any) => {
      if (!e.company || !e.role) return;
      const eTokens = cleanTokenize(`${e.company} ${e.role}`);
      const hasMatch = rawChunks.some(chunk => getOverlapWeight(cleanTokenize(chunk), eTokens) >= 0.8);
      if (hasMatch) {
        likelyDuplicates.push(`Experience: ${e.company} - ${e.role}`);
      }
    });

    if (likelyDuplicates.length > 0) {
      duplicateHints = `
  SIMILARITY ALGORITHM HINTS:
  We have run a local algorithm stripping articles and calculating token overlap weights.
  The following items from the user's existing profile appear to be strongly matching in this new text (high semantic weight):
  ${likelyDuplicates.map(d => `- ${d}`).join('\n')}

  CRITICAL DEDUPLICATION INSTRUCTION: 
  If you decide to extract information that pertains to the above hints, you MUST use the EXACT same 'name', 'company', and 'role' strings provided in the hints. This ensures our deterministic duplicate checker can properly merge the new bullets rather than duplicating the entities. Do not hallucinate variants of these names.
      `;
    }
  }

  const prompt = `
  You are an expert data extractor. An applicant has provided their resume or LinkedIn profile text. 
  Your goal is to parse this raw text and extract their detailed profile data into a strict JSON format.
  Extract absolutely everything found in the Raw Text.
  ${duplicateHints}

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
      "leetcode": "string",
      "codeforces": "string",
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
        "current": boolean,
        "cgpa": "string (optional)",
        "percentage": "string (optional)"
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

  let jsonStr = '{}';

  try {
    if (provider === 'gemini') {
      jsonStr = await executeWithRotation('gemini', apiKeys.gemini, async (apiKey) => {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            systemInstruction: "You are an expert extractor. Always structure the output in clean JSON. No markdown wrappers.",
            temperature: 0.1,
          }
        });
        return cleanJSON(response.text || '{}');
      });
    } else if (provider === 'groq') {
      jsonStr = await executeWithRotation('groq', apiKeys.groq, async (apiKey) => {
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
        return cleanJSON(chatCompletion.choices[0]?.message?.content || '{}');
      });
    } else if (provider === 'openai') {
      jsonStr = await executeWithRotation('openai', apiKeys.openai, async (apiKey) => {
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
        return cleanJSON(chatCompletion.choices[0]?.message?.content || '{}');
      });
    } else if (provider === 'anthropic') {
      jsonStr = await executeWithRotation('anthropic', apiKeys.anthropic, async (apiKey) => {
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
          return cleanJSON(content.text);
        }
        return '{}';
      });
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

export async function generateJSONResume(jobDescription: string, profileContext: string, docPrefs?: { docType: string; style: string; font: string; regenerationPrompt?: string }): Promise<string> {
  const { apiKeys, preferences } = useStore.getState();
  const provider = preferences.aiProvider || 'gemini';
  const model = preferences.aiModel || (provider === 'gemini' ? 'gemini-3.1-pro-preview' : 'llama-3.3-70b-versatile');

  let prefInstructions = "";
  if (docPrefs) {
    let constraints = "";
    if (docPrefs.docType === 'Resume') {
      constraints = `CRITICAL CONSTRAINT: You MUST output a concise resume that fits strictly on ONE page. Be extremely brief, filter out older or less relevant experience, and keep descriptions exceptionally short to ensure it fits perfectly within a single-page layout.`;
    } else {
      constraints = `NOTE: The document type is ${docPrefs.docType}, which can span multiple pages. Provide comprehensive and exhaustive details without artificially constraining it to a single page.`;
    }

    prefInstructions = `
    ADDITIONAL DOCUMENT PREFERENCES:
    - Document Type: ${docPrefs.docType}. (If "CV", provide exhaustive academic/comprehensive details. If "Cover Letter" is included in this type, add a "Cover Letter" entry at the top of the "miscellaneous" array containing the letter's text).
    - Tone & Style: ${docPrefs.style}. (Adapt bullet points: if minimalist, keep them crisp; if bold, use strong verbs; if academic, be formal and thorough).
    - Font/Look: ${docPrefs.font}.
    ${constraints}
    `;

    if (docPrefs.regenerationPrompt) {
      prefInstructions += `
      ======================================================================
      >>> CRITICAL USER REGENERATION INSTRUCTIONS (HIGH PRIORITY) <<<
      "${docPrefs.regenerationPrompt}"
      
      The user was NOT satisfied with the previous generation. You MUST drastically rewrite, reorganize, and adjust the content to explicitly satisfy the prompt above. DO NOT just copy-paste from the original context, and do NOT ignore this prompt. This is the MOST important instruction.
      ======================================================================
      `;
    }
  }

  const prompt = `
  You are an expert resume writer, recruiter, and career coach. Your task is to generate a highly tailored, ATS-friendly resume based on the user's provided profile context and the target job description.
  You MUST speak from the user's POV. Your goal is to guarantee the user gets the job.
  
  Target Job Description / Custom Instructions:
  ${jobDescription}

  ${prefInstructions}

  User Profile Context:
  ${profileContext}

  Please generate a polished, professional resume structured EXACTLY according to the following JSON schema. Do not output anything other than valid JSON. 
  
  CRITICAL INSTRUCTIONS:
  1. The generated resume MUST fill the entire page. 
  2. You must curate and order the items carefully: select the most relevant experiences, projects, and skills for the job description. Prioritize and reorder bullets and sections to match the job listing's emphasis.
  3. ABSOLUTELY DO NOT simply copy-paste from the profile context. You MUST completely rewrite, reframe, and elevate every bullet point to directly speak to the job description and the user's regeneration prompt. Synthesize points where necessary so it reads as a highly professional targeted document. Ensure the phrasing uses strong action verbs, quantifiable metrics, and directly mirrors the target terminology.
  4. Tailor the wording heavily to mirror the job description's terminology, but MAINTAIN INTEGRITY (do not completely fabricate non-existent roles or degrees).
  5. If there is not enough content to fill the page, creatively embellish existing details, expand on responsibilities, add plausible adjacent skills based on their profile, and include relevant miscellaneous/volunteer experiences to ensure the resume looks substantial, full, and perfectly suited to give the user a leg up.
  6. The resume MUST sound like it represents the user perfectly and guarantees them the job. You are generating a final polished document so it should know what it is writing.
  7. When specifying technologies for projects, output them purely as a comma-separated array of strings. Do not precede them with "Technologies:".

  
  {
    "personalInfo": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string",
      "github": "string",
      "leetcode": "string",
      "codeforces": "string",
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
    "awards": ["award string 1", "award string 2"],
    "coverLetter": "string (optional, only include if document type includes Cover Letter)"
  }

  IMPORTANT: Extract and map the user's data into these fields. For 'skills' object, try to map their skills into categories like Programming, Web, Databases, Tools, etc. For experience descriptions, enhance their bullet points to emphasize impact related to the job description if possible. Extract applicable content from 'miscellaneous' into 'awards' and 'certifications'.
  `;

  try {
    if (provider === 'gemini') {
      return await executeWithRotation('gemini', apiKeys.gemini, async (apiKey) => {
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
      });
    } else if (provider === 'groq') {
      return await executeWithRotation('groq', apiKeys.groq, async (apiKey) => {
        const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are an expert technical resume writer. Output only strict JSON." },
            { role: "user", content: prompt },
          ],
          model: model,
          temperature: 0.3,
          response_format: { type: "json_object" }
        });
        return chatCompletion.choices[0]?.message?.content || '{}';
      });
    } else if (provider === 'openai') {
      return await executeWithRotation('openai', apiKeys.openai, async (apiKey) => {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are an expert technical resume writer. Output only strict JSON." },
            { role: "user", content: prompt },
          ],
          model: model,
          temperature: 0.3,
          response_format: { type: "json_object" }
        });
        return chatCompletion.choices[0]?.message?.content || '{}';
      });
    } else if (provider === 'anthropic') {
      return await executeWithRotation('anthropic', apiKeys.anthropic, async (apiKey) => {
        const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
        const message = await anthropic.messages.create({
          model: model,
          max_tokens: 4096,
          temperature: 0.3,
          system: "You are an expert technical resume writer. Output only strict JSON. Do not include any markdown formatting or explanations.",
          messages: [{ role: "user", content: prompt }]
        });

        const content = message.content[0];
        if (content.type === 'text') {
          return cleanJSON(content.text);
        }
        return '{}';
      });
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



export async function generateLaTeXResume(
  jsonResume: string, 
  templateSelection: string, 
  styleSelection: string, 
  fontSelection: string, 
  documentType: string,
  baseTemplateCode: string
): Promise<string> {
  const { apiKeys, preferences } = useStore.getState();
  const provider = preferences.aiProvider || 'gemini';
  const model = preferences.aiModel || (provider === 'gemini' ? 'gemini-3.1-pro-preview' : 'llama-3.3-70b-versatile');

  const prompt = `
  You are an expert LaTeX developer and resume formatter.
  Your task is to take the provided JSON resume data and format it entirely within the provided LaTeX document template.
  
  Configuration Preferences:
  - Style: ${styleSelection}
  - Font/Look: ${fontSelection}
  - Document Type: ${documentType}

  Instruction: 
  Adapt the chosen template below to output a COMPLETE, ready-to-compile LaTeX document from the JSON data.
  The template provided includes the \\documentclass, preamble, and custom commands. Replace the '%% INSERT CONTENT HERE %%' blocks with the actual content using the commands defined in the template.
  
  CRITICAL RULES:
  1. The Document Type may include a Cover Letter. If there is a Cover Letter in the JSON, you MUST place the Cover Letter FIRST in the LaTeX document, then add a \\newpage, and then place the Resume/CV content.
  2. Use \\resumeSubheading{Role}{Date}{Company}{Location} for experiences. The template explicitly handles positioning, do NOT manually format the text with pipes or bold unless requested.
  3. Use \\resumeProjectHeading{Project Name}{Date}{Technologies Used}{Location} for projects. Pass the comma-separated technologies in the 3rd argument. Do NOT write "Technologies:".
  4. Ensure ALL \\begin{itemize} blocks have matching \\end{itemize} tags.
  5. Output the final, ready-to-compile LaTeX code in a single code block. Ensure the LaTeX code is complete, ATS-friendly, and has no missing brackets or broken syntax. Do not output anything outside the code block.
  6. CRITICAL: DO NOT modify, summarize, or alter the wording of the JSON data. Insert the text EXACTLY as provided in the JSON. What you output must EXACTLY MATCH the content of the provided JSON so the resulting LaTeX perfectly matches the user's expected HTML preview.

  JSON Resume Data:
  ${jsonResume}

  Base Template (or Custom Template) Code:
  ${baseTemplateCode}
  `;

  const cleanLaTeX = (text: string) => {
    let cleaned = text.trim();
    if (cleaned.startsWith('\`\`\`latex')) cleaned = cleaned.replace(/^\`\`\`latex/, '');
    if (cleaned.startsWith('\`\`\`tex')) cleaned = cleaned.replace(/^\`\`\`tex/, '');
    if (cleaned.startsWith('\`\`\`')) cleaned = cleaned.replace(/^\`\`\`/, '');
    if (cleaned.endsWith('\`\`\`')) cleaned = cleaned.replace(/\`\`\`$/, '');
    return cleaned.trim();
  };

  try {
    if (provider === 'gemini') {
      return await executeWithRotation('gemini', apiKeys.gemini, async (apiKey) => {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            systemInstruction: "You are an expert LaTeX developer. Only output valid LaTeX. No markdown explanations.",
            temperature: 0.2,
          }
        });
        return cleanLaTeX(response.text || '');
      });
    } else if (provider === 'groq') {
      return await executeWithRotation('groq', apiKeys.groq, async (apiKey) => {
        const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are an expert LaTeX developer. Output ONLY raw LaTeX code inside a single markdown block." },
            { role: "user", content: prompt },
          ],
          model: model,
          temperature: 0.2,
        });
        return cleanLaTeX(chatCompletion.choices[0]?.message?.content || '');
      });
    } else if (provider === 'openai') {
      return await executeWithRotation('openai', apiKeys.openai, async (apiKey) => {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are an expert LaTeX developer. Output ONLY raw LaTeX code inside a single markdown block." },
            { role: "user", content: prompt },
          ],
          model: model,
          temperature: 0.2,
        });
        return cleanLaTeX(chatCompletion.choices[0]?.message?.content || '');
      });
    } else if (provider === 'anthropic') {
      return await executeWithRotation('anthropic', apiKeys.anthropic, async (apiKey) => {
        const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
        const message = await anthropic.messages.create({
          model: model,
          max_tokens: 4000,
          temperature: 0.2,
          system: "You are an expert LaTeX developer. Output ONLY raw LaTeX code.",
          messages: [{ role: "user", content: prompt }]
        });

        const content = message.content[0];
        if (content.type === 'text') {
          return cleanLaTeX(content.text);
        }
        return '';
      });
    }
  } catch (error: any) {
    console.error('AI Error:', error);
    throw new Error(`Generation failed (${provider}): ${error.message || 'Unknown error'}`);
  }
  
  return '';
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
You must speak from the user's side and make use of the deep context you have of them. Answer from their POV when appropriate, instead of giving a generic answer.
Understand their profile intimately and tailor every response to give them a leg up and guarantee them success.

User Profile Context:
${profileContext}
`;

  try {
    if (provider === 'gemini') {
      return await executeWithRotation('gemini', apiKeys.gemini, async (apiKey) => {
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
      });
    } else if (provider === 'groq') {
      return await executeWithRotation('groq', apiKeys.groq, async (apiKey) => {
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
      });
    } else if (provider === 'openai') {
      return await executeWithRotation('openai', apiKeys.openai, async (apiKey) => {
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
      });
    } else if (provider === 'anthropic') {
      return await executeWithRotation('anthropic', apiKeys.anthropic, async (apiKey) => {
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
      });
    }
  } catch (error: any) {
    console.error('Chat Error:', error);
    throw new Error(`Chat failed (${provider}): ${error.message || 'Unknown error'}`);
  }

  throw new Error('Invalid AI provider selected.');
}
