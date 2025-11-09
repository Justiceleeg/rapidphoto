import { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { X } from "lucide-react-native";
import { BORDER_RADIUS } from "@/theme/globals";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = "Add a tag..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const backgroundColor = useColor("background");
  const foregroundColor = useColor("foreground");
  const borderColor = useColor("border");
  const mutedForegroundColor = useColor("mutedForeground");
  const inputColor = useColor("input");
  const secondaryColor = useColor("secondary");
  const secondaryForegroundColor = useColor("secondaryForeground");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue) && trimmedValue.length <= 50) {
      const newTags = [...value, trimmedValue];
      onChange(newTags);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleSubmitEditing = () => {
    addTag();
  };

  const handleBlur = () => {
    addTag();
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

      {/* Input Field */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: inputColor,
            borderColor: borderColor,
            color: foregroundColor,
          },
        ]}
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSubmitEditing}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={mutedForegroundColor}
        returnKeyType="done"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text variant="caption" style={[styles.hint, { color: mutedForegroundColor }]}>
        Press Enter to add a tag
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  hint: {
    fontSize: 12,
  },
});

