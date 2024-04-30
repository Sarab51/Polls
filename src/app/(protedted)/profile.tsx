import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../AuthProvider/AuthProvider";
import { supabase } from "../../lib/supabase";
import { Redirect } from "expo-router";

export default function profile() {
  const { user } = useAuth();
  return (
    <View>
      <Text>User Id: {user?.id}</Text>
      <Button title="SignOut" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({});
