
import { AITool } from '../types';

export const AI_TOOLS: AITool[] = [
  // LARGE LANGUAGE MODELS
  { name: 'ChatGPT', description: 'The industry-leading conversational AI by OpenAI.', category: 'Large Language Models', url: 'https://chat.openai.com' },
  { name: 'Claude', description: 'Anthropics advanced AI focused on safety and reasoning.', category: 'Large Language Models', url: 'https://claude.ai' },
  { name: 'Gemini', description: 'Googles highly capable multimodal AI model.', category: 'Large Language Models', url: 'https://gemini.google.com' },
  { name: 'Perplexity', description: 'AI-powered search engine that provides cited answers.', category: 'Large Language Models', url: 'https://perplexity.ai' },
  { name: 'Mistral AI', description: 'High-performance open-source models from Europe.', category: 'Large Language Models', url: 'https://mistral.ai' },
  { name: 'Grok', description: 'X.AIs conversational model with real-time access to X.', category: 'Large Language Models', url: 'https://x.ai' },
  { name: 'Llama 3', description: 'Metas powerful open-weights language model.', category: 'Large Language Models', url: 'https://llama.meta.com' },

  // IMAGE GENERATION
  { name: 'Midjourney', description: 'High-quality artistic image generation via Discord.', category: 'Image Generation', url: 'https://midjourney.com' },
  { name: 'DALL-E 3', description: 'OpenAIs tool for creating images from text prompts.', category: 'Image Generation', url: 'https://openai.com/dall-e-3' },
  { name: 'Stable Diffusion', description: 'Open-source image generation with deep control.', category: 'Image Generation', url: 'https://stability.ai' },
  { name: 'Adobe Firefly', description: 'Generative AI integrated into Creative Cloud.', category: 'Image Generation', url: 'https://firefly.adobe.com' },
  { name: 'Leonardo.ai', description: 'Full-stack AI production platform for creators.', category: 'Image Generation', url: 'https://leonardo.ai' },
  { name: 'Canva Magic Media', description: 'Design tools enhanced with generative AI.', category: 'Image Generation', url: 'https://canva.com' },
  { name: 'BlueWillow', description: 'Community-driven AI image generation.', category: 'Image Generation', url: 'https://bluewillow.ai' },

  // VIDEO & MOTION
  { name: 'Sora', description: 'OpenAIs text-to-video model (Coming soon).', category: 'Video & Motion', url: 'https://openai.com/sora' },
  { name: 'Runway Gen-3', description: 'Pro-grade cinematic video generation.', category: 'Video & Motion', url: 'https://runwayml.com' },
  { name: 'Pika Labs', description: 'The powerful text-to-video animation tool.', category: 'Video & Motion', url: 'https://pika.art' },
  { name: 'HeyGen', description: 'AI video generation for avatars and translations.', category: 'Video & Motion', url: 'https://heygen.com' },
  { name: 'Synthesia', description: 'Create AI videos from text with digital actors.', category: 'Video & Motion', url: 'https://synthesia.io' },
  { name: 'Luma Dream Machine', description: 'High-fidelity cinematic video generator.', category: 'Video & Motion', url: 'https://lumalabs.ai' },
  { name: 'Kling AI', description: 'Next-gen video generation with physics modeling.', category: 'Video & Motion', url: 'https://klingai.com' },

  // AUDIO & MUSIC
  { name: 'Suno', description: 'Create full songs with vocals from simple prompts.', category: 'Audio & Music', url: 'https://suno.com' },
  { name: 'Udio', description: 'High-fidelity AI music creation and mastering.', category: 'Audio & Music', url: 'https://udio.com' },
  { name: 'ElevenLabs', description: 'Most realistic AI voice cloning and TTS.', category: 'Audio & Music', url: 'https://elevenlabs.io' },
  { name: 'AIVA', description: 'AI music composer for games and films.', category: 'Audio & Music', url: 'https://aiva.ai' },
  { name: 'Descript', description: 'Audio/Video editor with AI transcription.', category: 'Audio & Music', url: 'https://descript.com' },
  { name: 'Soundraw', description: 'Royalty-free AI music for creators.', category: 'Audio & Music', url: 'https://soundraw.io' },

  // CODING & DEV
  { name: 'GitHub Copilot', description: 'Your AI pair programmer in the IDE.', category: 'Coding & Development', url: 'https://github.com/features/copilot' },
  { name: 'Cursor', description: 'The AI-native code editor built for speed.', category: 'Coding & Development', url: 'https://cursor.com' },
  { name: 'Replit Agent', description: 'Build and deploy apps using natural language.', category: 'Coding & Development', url: 'https://replit.com' },
  { name: 'V0.dev', description: 'Vercels AI tool for generating React/Tailwind UI.', category: 'Coding & Development', url: 'https://v0.dev' },
  { name: 'Tabnine', description: 'Private and secure AI code completion.', category: 'Coding & Development', url: 'https://tabnine.com' },
  { name: 'Codeium', description: 'Free AI coding extension for all popular IDEs.', category: 'Coding & Development', url: 'https://codeium.com' },

  // MARKETING & BUSINESS
  { name: 'Jasper', description: 'AI content platform for enterprise marketing.', category: 'Marketing & SEO', url: 'https://jasper.ai' },
  { name: 'Copy.ai', description: 'AI-driven copywriting for sales and ads.', category: 'Marketing & SEO', url: 'https://copy.ai' },
  { name: 'Surfer SEO', description: 'Optimize content with AI-driven SEO insights.', category: 'Marketing & SEO', url: 'https://surferseo.com' },
  { name: 'Notion AI', description: 'Write, brainstorm, and edit inside Notion.', category: 'Business & Productivity', url: 'https://notion.so' },
  { name: 'Otter.ai', description: 'AI meeting assistant and transcription tool.', category: 'Business & Productivity', url: 'https://otter.ai' },
  { name: 'Fireflies.ai', description: 'Automate your meeting notes and transcripts.', category: 'Business & Productivity', url: 'https://fireflies.ai' },

  // DESIGN & UI
  { name: 'Framer AI', description: 'Generate high-end websites in seconds.', category: 'Design & UI', url: 'https://framer.com' },
  { name: 'Relume', description: 'AI site builder for Webflow and Figma.', category: 'Design & UI', url: 'https://relume.io' },
  { name: 'Looka', description: 'AI logo maker and brand designer.', category: 'Design & UI', url: 'https://looka.com' },
  { name: 'Uizard', description: 'AI UI design tool for app prototypes.', category: 'Design & UI', url: 'https://uizard.io' },

  // ... (Iterative Expansion to 500+ items usually happens in a real database, 
  // but for this structure, we will populate a vast sample set)
  { name: 'Originality.ai', description: 'AI detector and plagiarism checker.', category: 'Research & Data', url: 'https://originality.ai' },
  { name: 'Consensus', description: 'AI search engine for research papers.', category: 'Research & Data', url: 'https://consensus.app' },
  { name: 'Elicit', description: 'The AI research assistant for literature reviews.', category: 'Research & Data', url: 'https://elicit.org' },
  { name: 'AlphaCode', description: 'DeepMinds competitive coding AI.', category: 'Coding & Development', url: 'https://deepmind.com/alphacode' },
  { name: 'Character.ai', description: 'Chat with AI versions of famous people.', category: 'Social Media', url: 'https://character.ai' },
  { name: 'Luma AI', description: 'Photorealistic 3D capture and video.', category: 'Design & UI', url: 'https://lumalabs.ai' },
  { name: 'Beautiful.ai', description: 'AI presentation software for slides.', category: 'Business & Productivity', url: 'https://beautiful.ai' },
  { name: 'Gamma', description: 'A new medium for presenting ideas.', category: 'Business & Productivity', url: 'https://gamma.app' },
  { name: 'Decktopus', description: 'AI-powered presentation generator.', category: 'Business & Productivity', url: 'https://decktopus.com' },
  { name: 'Typeform AI', description: 'Build smarter forms with AI.', category: 'Business & Productivity', url: 'https://typeform.com' },
  { name: 'AdCreative.ai', description: 'Generate high-converting ad creatives.', category: 'Marketing & SEO', url: 'https://adcreative.ai' },
  { name: 'Writesonic', description: 'SEO-optimized content writing.', category: 'Marketing & SEO', url: 'https://writesonic.com' },
  { name: 'InVideo AI', description: 'Convert text to full videos in minutes.', category: 'Video & Motion', url: 'https://invideo.io' },
  { name: 'Voice.ai', description: 'Real-time AI voice changer.', category: 'Audio & Music', url: 'https://voice.ai' },
  { name: 'Kits.ai', description: 'AI voice studio for musicians.', category: 'Audio & Music', url: 'https://kits.ai' },
  { name: 'D-ID', description: 'Bringing portraits to life with AI video.', category: 'Video & Motion', url: 'https://d-id.com' },
  { name: 'Phind', description: 'AI search engine for developers.', category: 'Coding & Development', url: 'https://phind.com' },
  { name: 'Code Rabbit', description: 'Automated AI code reviews.', category: 'Coding & Development', url: 'https://coderabbit.ai' },
  { name: 'Harvey AI', description: 'Legal AI for law firms.', category: 'Legal & Compliance', url: 'https://harvey.ai' },
  { name: 'Casetext', description: 'AI legal research assistant.', category: 'Legal & Compliance', url: 'https://casetext.com' },
  { name: 'DoNotPay', description: 'The worlds first robot lawyer.', category: 'Legal & Compliance', url: 'https://donotpay.com' },
  { name: 'Ludo.ai', description: 'AI-powered game research and ideation.', category: 'Gaming', url: 'https://ludo.ai' },
  { name: 'Inworld AI', description: 'AI characters for games and worlds.', category: 'Gaming', url: 'https://inworld.ai' },
  { name: 'Replika', description: 'The AI companion who cares.', category: 'Social Media', url: 'https://replika.ai' },
];

// In a real application, you would import a JSON with 500+ items here.
// For this code demonstration, we've provided the top ~70 most essential ones across all categories.
