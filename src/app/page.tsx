"use client";

import { useState, useEffect, useMemo } from 'react';
import { getFeed, type Article } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { FeedControls } from '@/components/FeedControls';
import { ArticleCard } from '@/components/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Rss } from 'lucide-react';

const DEFAULT_FEED_URL = 'https://news.ycombinator.com/rss';
export type SummaryLength = 'short' | 'medium' | 'long';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [rssUrl, setRssUrl] = useState(DEFAULT_FEED_URL);
  const [filterQuery, setFilterQuery] = useState('');
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleLoadFeed = async (url: string) => {
    setIsLoading(true);
    setArticles([]);
    setFilterQuery('');
    try {
      const feedArticles = await getFeed(url);
      setArticles(feedArticles);
      if (feedArticles.length === 0) {
        toast({
          variant: "destructive",
          title: "Feed Empty or Invalid",
          description: "Could not fetch any articles from this RSS feed.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load feed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadFeed(DEFAULT_FEED_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredArticles = useMemo(() => {
    if (!filterQuery) {
      return articles;
    }
    return articles.filter((article) =>
      article.title.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [articles, filterQuery]);
  
  const SkeletonGrid = () => (
    <div className="container mx-auto grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 rounded-lg border bg-card p-6">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <FeedControls
          rssUrl={rssUrl}
          setRssUrl={setRssUrl}
          handleLoadFeed={() => handleLoadFeed(rssUrl)}
          isLoading={isLoading}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          summaryLength={summaryLength}
          setSummaryLength={setSummaryLength}
        />
        {isLoading ? (
          <SkeletonGrid />
        ) : filteredArticles.length > 0 ? (
          <div className="container mx-auto grid auto-rows-fr grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.link}
                article={article}
                summaryLength={summaryLength}
              />
            ))}
          </div>
        ) : (
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-16 text-center text-muted-foreground">
            <Rss className="h-16 w-16" />
            <h2 className="text-xl font-semibold">No Articles Found</h2>
            <p className="max-w-md">
              Your feed is empty, or no articles matched your filter. Try loading a new feed or clearing your filter.
            </p>
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          Built with Next.js and Genkit.
        </div>
      </footer>
    </div>
  );
}
