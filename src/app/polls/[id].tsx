import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Database } from "../../types/supabase";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../AuthProvider/AuthProvider";

type Poll = Database["public"]["Tables"]["polls"]["Row"];
type Vote = Database["public"]["Tables"]["poll_vote"]["Row"];

export default function pollDetails() {
  const [selected, setSelected] = useState();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll>(null);
  const { user } = useAuth();

  //calling database
  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase
        .from("polls")
        .select("*")
        .eq("id", Number.parseInt(id))
        .single();
      if (error) {
        Alert.alert("Error fatching data");
      }

      setPoll(data);
    };
    fetchPolls();
  }, []);

  //submitting vote to the database
  const Vote = async () => {
    const { data, error } = await supabase
      .from("poll_vote")
      .insert([{ option: selected, poll_id: poll.id, user_id: user.id }])
      .select();

    if (error) {
      Alert.alert("Failed to Vote");
    } else {
      Alert.alert("Thank you for your vote");
      router.back();
    }
  };
  if (!poll) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Voting" }} />
      <Text style={styles.question}>{poll.question}</Text>
      <View style={{ gap: 5 }}>
        {poll.options.map((option) => (
          <Pressable
            onPress={() => setSelected(option)}
            style={styles.optionContainer}
            key={option}
          >
            <Feather
              name={option === selected ? "check-circle" : "circle"}
              size={18}
              color={option === selected ? "green" : "gray"}
            />
            <Text>{option}</Text>
          </Pressable>
        ))}
      </View>
      <Button title="Vote" onPress={Vote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
  },
  optionContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
