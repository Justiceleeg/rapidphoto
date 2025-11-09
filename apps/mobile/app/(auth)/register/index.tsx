import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "@/components/ui/view";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({ email, password, name });
      if (result.data) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="heading" style={styles.title}>
        Register
      </Text>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
            autoComplete="name"
          />
        </View>
        <View style={styles.inputGroup}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>
        <View style={styles.inputGroup}>
          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            autoCapitalize="none"
            autoComplete="password"
          />
        </View>
        <Button
          disabled={isLoading}
          loading={isLoading}
          onPress={handleSubmit}
          style={styles.button}
          animation={false}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </View>
      <View style={styles.footer}>
        <Text variant="body" style={styles.footerText}>
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text variant="link" style={styles.linkText}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#71717a",
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
