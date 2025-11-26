import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="auth/login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="eventos/index"
        options={{ title: "Eventos" }}
      />
      <Stack.Screen
        name="eventos/[id]"
        options={{ title: "Detalle del evento" }}
      />
      <Stack.Screen
        name="estadisticas/index"
        options={{ title: "Estadísticas" }}
      />
    </Stack>
  );
}
