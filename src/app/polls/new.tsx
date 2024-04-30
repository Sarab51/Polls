import { Redirect, Stack, router } from "expo-router";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../../AuthProvider/AuthProvider";
import { supabase } from "../../lib/supabase";

export default function Createpoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  //checking if user enter any question or not
  const createPoll = async () => {
    setError("");
    if (!question) {
      setError("Please Provide question");
      return;
    }

    // //checking for atleast 2 options
    const validOptions = options.filter((opt) => !!opt);
    if (validOptions.length < 2) {
      setError("Please Provide at least 2 valid options");
      return;
    }
    //Sending new poll to the database

    const { data, error } = await supabase
      .from("polls")
      .insert([{ question, options: validOptions }])
      .select();
    if (error) {
      Alert.alert("Failed to create poll");
      console.log(error);
      return;
    }
    Alert.alert("Poll is created Successfully!");
    router.back();
  };

  //redirecting user if not login
  if (!user) {
    return <Redirect href={"/login"} />;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create Poll" }} />
      <Text style={styles.label}> Title</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Type your Question here"
        style={styles.input}
      />

      <Text style={styles.label}> Options</Text>

      {options.map((option, index) => (
        <View key={index} style={{ justifyContent: "center" }}>
          <TextInput
            key={index}
            value={option}
            onChangeText={(text) => {
              const updated = [...options];
              updated[index] = text;
              setOptions(updated);
            }}
            placeholder={`Option ${index + 1}`}
            style={styles.input}
          />
          <Feather
            name="x"
            size={22}
            onPress={() => {
              //option delete on index based
              const updated = [...options];
              updated.splice(index, 1);
              setOptions(updated);
            }}
            color="red"
            style={{ position: "absolute", right: 10 }}
          />
        </View>
      ))}

      <Button title="Add Option" onPress={() => setOptions([...options, ""])} />

      <Button title="Create poll" onPress={createPoll} />
      <Text style={{ color: "red" }}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 5,
  },
  label: { fontWeight: "500", marginTop: 10 },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
