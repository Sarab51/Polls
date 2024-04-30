import { Redirect, Slot } from "expo-router";
import { useAuth } from "../../AuthProvider/AuthProvider";

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href={"/profile"} />;
  }

  return <Slot />;
}
