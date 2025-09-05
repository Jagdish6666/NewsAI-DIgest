"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Rss, Search } from "lucide-react";
import type { SummaryLength } from "@/app/page";

interface FeedControlsProps {
  rssUrl: string;
  setRssUrl: (url: string) => void;
  handleLoadFeed: () => void;
  isLoading: boolean;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
  summaryLength: SummaryLength;
  setSummaryLength: (length: SummaryLength) => void;
}

export function FeedControls({
  rssUrl,
  setRssUrl,
  handleLoadFeed,
  isLoading,
  filterQuery,
  setFilterQuery,
  summaryLength,
  setSummaryLength,
}: FeedControlsProps) {
  
  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoadFeed();
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid gap-6 rounded-lg border bg-card p-4 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="rss-url">Custom RSS Feed</Label>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <Rss className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="rss-url"
                  type="url"
                  placeholder="https://news.ycombinator.com/rss"
                  value={rssUrl}
                  onChange={(e) => setRssUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : "Load"}
              </Button>
            </form>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter">Filter Articles</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="filter"
                type="text"
                placeholder="Filter by keyword..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary-length">Summary Length</Label>
            <Select value={summaryLength} onValueChange={(value: SummaryLength) => setSummaryLength(value)}>
              <SelectTrigger id="summary-length">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
