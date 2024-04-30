import { Link, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/supabase";

//const polls = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

type Poll = Database["public"]["Tables"]["polls"]["Row"];

export default function HomeScreen() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase.from("polls").select("*");
      if (error) {
        console.warn("Error fatching data");
      }

      setPolls(data);
    };
    fetchPolls();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Polls",
          headerRight: () => (
            <Link href={"/polls/new"}>
              <AntDesign name="plus" size={20} color="gray" />
            </Link>
          ),
          headerLeft: () => (
            <Link href={"/profile"}>
              <AntDesign name="user" size={18} color="gray" />
            </Link>
          ),
        }}
      />
      <FlatList
        data={polls}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Link href={`/polls/${item.id}`} style={styles.pollContainer}>
            <Text style={styles.pollTitle}>{item.question}</Text>
          </Link>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
    gap: 5,
  },
  pollContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
