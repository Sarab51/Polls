import { Redirect, Slot } from "expo-router";
import { useAuth } from "../../AuthProvider/AuthProvider";

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href={"/login"} />;
  }

  return <Slot />;
}
