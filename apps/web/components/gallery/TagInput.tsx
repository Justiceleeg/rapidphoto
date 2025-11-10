"use client";

import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { photoClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  enableAutocomplete?: boolean;
}

export function TagInput({ 
  value, 
  onChange, 
  placeholder = "Add a tag...",
  enableAutocomplete = false 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedPrefix, setDebouncedPrefix] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce the input value for autocomplete
  useEffect(() => {
    if (!enableAutocomplete) return;
    
    const timer = setTimeout(() => {
      setDebouncedPrefix(inputValue.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, enableAutocomplete]);

  // Fetch tag suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ["tags", debouncedPrefix],
    queryFn: () => photoClient.getTags(debouncedPrefix || undefined),
    enabled: enableAutocomplete && debouncedPrefix.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter out tags that are already selected
  const filteredSuggestions = suggestions.filter(
    (tag) => !value.includes(tag) && tag.toLowerCase().includes(debouncedPrefix)
  );

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      // If there are suggestions and one is highlighted, select it
      if (enableAutocomplete && filteredSuggestions.length > 0 && showSuggestions) {
        selectSuggestion(filteredSuggestions[0]);
      } else {
        addTag();
      }
    } else if (e.key === "ArrowDown" && enableAutocomplete && filteredSuggestions.length > 0) {
      e.preventDefault();
      setShowSuggestions(true);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
      if (inputValue) {
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(value[value.length - 1]);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      const newTags = [...value, trimmedValue];
      onChange(newTags);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (tag: string) => {
    if (!value.includes(tag)) {
      const newTags = [...value, tag];
      onChange(newTags);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (enableAutocomplete && e.target.value.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2 relative">
      {/* Tag Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field with Autocomplete */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (enableAutocomplete && inputValue.trim().length > 0 && filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay to allow suggestion click
            setTimeout(() => {
              if (inputValue.trim()) {
                addTag();
              }
              setShowSuggestions(false);
            }, 200);
          }}
          placeholder={placeholder}
          className="w-full"
        />
        
        {/* Autocomplete Suggestions Dropdown */}
        {enableAutocomplete && showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => selectSuggestion(tag)}
                className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add a tag
        {enableAutocomplete && " • Start typing for suggestions"}
      </p>
    </div>
  );
}

