"use server";

import { summarizeArticle } from '@/ai/flows/customize-summary-length';

export interface Article {
  title: string;
  link: string;
  pubDate: string;
}

// A very basic and fragile RSS parser. It is designed to work with common RSS formats but might fail on complex or non-standard feeds.
const parseRSS = (xml: string): Article[] => {
  try {
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    return items.map((item) => {
      const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

      return {
        title: titleMatch ? titleMatch[1].trim() : 'No title',
        link: linkMatch ? linkMatch[1].trim() : '#',
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
      };
    }).filter(article => article.link !== '#');
  } catch (error) {
    console.error('Error parsing RSS:', error);
    return [];
  }
};

export async function getFeed(url: string): Promise<Article[]> {
  try {
    // Add protocol if missing
    const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const response = await fetch(fullUrl, { 
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'User-Agent': 'NewsAI-Digest/1.0',
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    const xmlText = await response.text();
    const articles = parseRSS(xmlText);
    // Sort by publication date, newest first
    return articles.sort((a, b) => {
        try {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        } catch {
            return 0;
        }
    });
  } catch (error) {
    console.error(`Error in getFeed for ${url}:`, error);
    if (error instanceof Error && error.message.includes('fetch')) {
       throw new Error('Could not fetch the RSS feed. Check the URL and network connection.');
    }
    throw new Error('Could not parse the RSS feed. The format might be invalid.');
  }
}

// A basic content extractor. It may struggle with client-side rendered pages or complex layouts.
const fetchArticleContent = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const html = await response.text();
        
        const cleanedHtml = html
            .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
            .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
            .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
            .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Try to find the main content area
        let mainContentMatch = cleanedHtml.match(/<(?:main|article)[^>]*>([\s\S]*?)<\/(?:main|article)>/i);
        let contentSource = mainContentMatch ? mainContentMatch[1] : cleanedHtml;

        const paragraphs = contentSource.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);

        if (!paragraphs || paragraphs.length < 3) {
             const text = contentSource.replace(/<[^>]+>/g, ' ').replace(/\s\s+/g, ' ').trim();
             return text.substring(0, 15000);
        }

        const content = paragraphs
            .map(p => p.replace(/<[^>]+>/g, ''))
            .join('\n')
            .replace(/(\r\n|\n|\r){3,}/g, '\n\n')
            .trim();

        return content.substring(0, 15000); // Limit content size for the AI model
    } catch (error) {
        console.error(`Error fetching article content from ${url}:`, error);
        throw new Error('Could not fetch article content.');
    }
};


export async function getArticleSummary(
  articleUrl: string,
  summaryLength: 'short' | 'medium' | 'long'
): Promise<{ summary: string }> {
  try {
    const articleContent = await fetchArticleContent(articleUrl);
    
    if (articleContent.length < 100) {
        return { summary: "Could not extract enough readable content from the article to generate a summary. The page might be heavily reliant on JavaScript or have a non-standard format." };
    }

    const result = await summarizeArticle({
      articleContent,
      summaryLength,
    });
    
    return { summary: result.summary };
  } catch (error) {
    console.error('Error getting article summary:', error);
    throw new Error('The AI model failed to generate a summary.');
  }
}
