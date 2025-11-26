// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Login */}
        <Stack.Screen
          name="auth/login"
          options={{ headerShown: false }}
        />

        {/* Usuario */}
        <Stack.Screen
          name="eventos/index"
          options={{ title: "Eventos" }}
        />
        <Stack.Screen
          name="eventos/[id]"
          options={{ title: "Detalle del evento" }}
        />

        {/* Admin */}
        <Stack.Screen
          name="admin/eventos/index"
          options={{ title: "Eventos (Admin)" }}
        />
        <Stack.Screen
          name="admin/eventos/form"
          options={{ title: "Crear / Editar evento" }}
        />
        <Stack.Screen
          name="admin/historial/index"
          options={{ title: "Historial y estadísticas" }}
        />
        <Stack.Screen
          name="admin/historial/[id]"
          options={{ title: "Estadísticas del evento" }}
        />
      </Stack>
    </AuthProvider>
  );
}
