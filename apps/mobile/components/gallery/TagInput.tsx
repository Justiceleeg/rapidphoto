import { useState, useEffect, useRef } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { X } from "lucide-react-native";
import { BORDER_RADIUS } from "@/theme/globals";
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
  const inputRef = useRef<TextInput>(null);
  const backgroundColor = useColor("background");
  const foregroundColor = useColor("foreground");
  const borderColor = useColor("border");
  const mutedForegroundColor = useColor("mutedForeground");
  const inputColor = useColor("input");
  const secondaryColor = useColor("secondary");
  const secondaryForegroundColor = useColor("secondaryForeground");
  const cardColor = useColor("card");
  const accentColor = useColor("accent");
  const accentForegroundColor = useColor("accentForeground");

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

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue) && trimmedValue.length <= 50) {
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

  const handleSubmitEditing = () => {
    // If there are suggestions and one is available, select it
    if (enableAutocomplete && filteredSuggestions.length > 0 && showSuggestions) {
      selectSuggestion(filteredSuggestions[0]);
    } else {
      addTag();
    }
  };

  const handleBlur = () => {
    // Delay to allow suggestion tap
    setTimeout(() => {
      if (inputValue.trim()) {
        addTag();
      }
      setShowSuggestions(false);
    }, 200);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (enableAutocomplete && text.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (enableAutocomplete && inputValue.trim().length > 0 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tag Display */}
      {value.length > 0 && (
        <View style={styles.tagsContainer}>
          {value.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
              <View style={styles.tagContent}>
                <Text variant="caption" style={[styles.tagText, { color: secondaryForegroundColor }]}>
                  {tag}
                </Text>
                <TouchableOpacity
                  onPress={() => removeTag(tag)}
                  style={styles.removeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={12} color={mutedForegroundColor} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Input Field with Autocomplete */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              backgroundColor: inputColor,
              borderColor: borderColor,
              color: foregroundColor,
            },
          ]}
          value={inputValue}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={mutedForegroundColor}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {/* Autocomplete Suggestions */}
        {enableAutocomplete && showSuggestions && filteredSuggestions.length > 0 && (
          <View style={[styles.suggestionsContainer, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <FlatList
              data={filteredSuggestions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.suggestionItem, { borderBottomColor: borderColor }]}
                  onPress={() => selectSuggestion(item)}
                >
                  <Text variant="body" style={{ color: foregroundColor }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </View>
      
      <Text variant="caption" style={[styles.hint, { color: mutedForegroundColor }]}>
        Press Enter to add a tag
        {enableAutocomplete && " • Start typing for suggestions"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    gap: 4,
    alignSelf: "flex-start",
  },
  tagContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  removeButton: {
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    position: "relative",
    marginHorizontal: 4, // Reduce width by 8px total (4px on each side)
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  hint: {
    fontSize: 12,
  },
});

