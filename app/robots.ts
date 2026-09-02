import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/content'

/**
 * AI answer-engine and LLM crawlers we explicitly welcome, on top of the
 * general '*' rule below. Listed by name — rather than relying only on the
 * wildcard — so a future edit meant to block some other bot can't
 * accidentally lock ChatGPT, Claude, Gemini, Perplexity, and friends out of
 * a site whose whole point is to be quoted and recommended by them.
 */
const aiCrawlers = [
  'GPTBot', // OpenAI / ChatGPT training + browsing
  'OAI-SearchBot', // OpenAI search (ChatGPT search results)
  'ChatGPT-User', // ChatGPT live browsing on a user's behalf
  'ClaudeBot', // Anthropic crawler
  'Claude-User', // Claude live browsing on a user's behalf
  'Claude-SearchBot', // Claude search
  'anthropic-ai',
  'PerplexityBot', // Perplexity indexing
  'Perplexity-User', // Perplexity live browsing
  'Google-Extended', // Gemini / Google AI Overviews training
  'GoogleOther',
  'Applebot-Extended', // Apple Intelligence / Siri
  'Bingbot', // Microsoft Copilot
  'CCBot', // Common Crawl — feeds many third-party LLMs
  'Amazonbot', // Amazon / Alexa+
  'Meta-ExternalAgent', // Meta AI
  'FacebookBot',
  'DuckAssistBot', // DuckDuckGo AI Assist
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/admin', '/api'],
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
