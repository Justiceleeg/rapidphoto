import { View, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TagInput } from "./TagInput";
import { X } from "lucide-react-native";
import { useColor } from "@/hooks/useColor";

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
  const foregroundColor = useColor("foreground");
  const mutedForegroundColor = useColor("mutedForeground");
  const primaryColor = useColor("primary");

  return (
    <Card style={styles.card}>
      <View style={[styles.container, { padding: 8 }]}>
        <View style={styles.inputSection}>
          <Text variant="caption" style={[styles.label, { color: mutedForegroundColor }]}>
            Search by Tags
          </Text>
          <TagInput
            value={tags}
            onChange={onTagsChange}
            placeholder="Type to search by tags..."
            enableAutocomplete={true}
          />
        </View>

        <View style={styles.controls}>
          <View style={styles.checkboxContainer}>
            <Switch
              value={includeSuggested}
              onValueChange={onIncludeSuggestedChange}
              trackColor={{ false: mutedForegroundColor + "40", true: primaryColor + "80" }}
              thumbColor={includeSuggested ? primaryColor : "#f4f3f4"}
              ios_backgroundColor={mutedForegroundColor + "40"}
            />
            <Text variant="body" style={[styles.checkboxLabel, { color: foregroundColor }]}>
              Include AI-suggested tags
            </Text>
          </View>

          {hasActiveSearch && (
            <Button
              variant="ghost"
              size="sm"
              onPress={onClear}
              style={styles.clearButton}
            >
              <X size={16} color={mutedForegroundColor} strokeWidth={2} />
              <Text variant="body" style={[styles.clearText, { color: mutedForegroundColor }]}>
                Clear
              </Text>
            </Button>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    marginBottom: 16,
    padding: 0, // Override Card's default padding
  },
  container: {
    gap: 16,
  },
  inputSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 14,
  },
});

