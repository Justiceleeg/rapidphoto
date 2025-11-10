"use client";

import { TagInput } from "./TagInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TagSearchProps {
  tags: string[];
  includeSuggested: boolean;
  onTagsChange: (tags: string[]) => void;
  onIncludeSuggestedChange: (include: boolean) => void;
  onClear: () => void;
}

export function TagSearch({
  tags,
  includeSuggested,
  onTagsChange,
  onIncludeSuggestedChange,
  onClear,
}: TagSearchProps) {
  const hasActiveSearch = tags.length > 0 || includeSuggested;

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tag-search" className="text-sm font-medium">
          Search by Tags
        </Label>
        <TagInput
          value={tags}
          onChange={onTagsChange}
          placeholder="Type to search by tags..."
          enableAutocomplete={true}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="include-suggested"
            checked={includeSuggested}
            onChange={(e) => onIncludeSuggestedChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label
            htmlFor="include-suggested"
            className="text-sm font-normal cursor-pointer"
          >
            Include AI-suggested tags
          </Label>
        </div>

        {hasActiveSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 px-2"
          >
            <X className="mr-1 size-4" />
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}

