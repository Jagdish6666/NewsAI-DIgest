"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PresetFeed {
  name: string;
  url: string;
}

interface PresetFeedsProps {
  feeds: PresetFeed[];
  onSelect: (url: string) => void;
  currentUrl: string;
}

export function PresetFeeds({ feeds, onSelect, currentUrl }: PresetFeedsProps) {
  const selectedValue = feeds.find(feed => feed.url === currentUrl)?.url || "custom";

  return (
    <Select onValueChange={(value) => value !== "custom" && onSelect(value)} value={selectedValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select a feed..." />
      </SelectTrigger>
      <SelectContent>
        {feeds.map((feed) => (
          <SelectItem key={feed.url} value={feed.url}>
            {feed.name}
          </SelectItem>
        ))}
         <SelectItem value="custom" disabled={selectedValue !== "custom"}>
          Custom URL
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
