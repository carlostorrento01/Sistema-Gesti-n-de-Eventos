import React from "react";
import { Redirect } from "expo-router";

export default function TabHome() {
  // Cuando el usuario entra al tab principal, lo enviamos al login
  return <Redirect href="/auth/login" />;
}
