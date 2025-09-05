"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ExternalLink, Sparkles } from "lucide-react";
import { getArticleSummary, type Article } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

type SummaryLength = "short" | "medium" | "long";

interface ArticleCardProps {
  article: Article;
  summaryLength: SummaryLength;
}

export function ArticleCard({ article, summaryLength }: ArticleCardProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setError("");
    setSummary("");
    try {
      const result = await getArticleSummary(article.link, summaryLength);
      setSummary(result.summary);
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formattedDate = article.pubDate ? formatDistanceToNow(new Date(article.pubDate), { addSuffix: true }) : '';

  return (
    <Card className="flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-lg leading-snug">
          {article.title}
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-2 pt-1">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary/80 hover:text-primary hover:underline transition-colors"
          >
            Read Original <ExternalLink className="h-3 w-3" />
          </a>
          {formattedDate && (
            <>
              <span className="text-muted-foreground">&middot;</span>
              <span className="text-sm text-muted-foreground">{formattedDate}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        {summary && <p className="text-sm text-foreground/80 whitespace-pre-wrap">{summary}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSummarize} disabled={isLoading} className="w-full sm:w-auto" variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Summarizing..." : (summary ? "Re-summarize" : "Summarize with AI")}
        </Button>
      </CardFooter>
    </Card>
  );
}
