import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../services/eventStorage";

// 🔐 Usuarios que pueden ser admin
const ADMIN_USERS = ["kevin", "admin"]; // cámbialos a los que quieras

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<UserRole>("user");

  const handleLogin = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Ingresa tu nombre");
      return;
    }

    if (role === "admin") {
      const isAllowed = ADMIN_USERS.includes(trimmed.toLowerCase());
      if (!isAllowed) {
        alert("No tienes permisos de administrador. Ingresa como usuario.");
        return;
      }
    }

    await login(trimmed, role);

    if (role === "admin") {
      router.replace("/admin/eventos" as any);
    } else {
      router.replace("/eventos" as any);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f172a", // azul oscuro
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
          padding: 20,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 4,
            color: "#111827",
          }}
        >
          Comunidad Connect
        </Text>
        <Text style={{ color: "#6b7280", marginBottom: 16 }}>
          Inicia sesión para gestionar y participar en los eventos
        </Text>

        <Text style={{ marginBottom: 4 }}>Nombre</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
          }}
          placeholder="Escribe tu nombre"
          value={name}
          onChangeText={setName}
        />

        <Text style={{ marginBottom: 8 }}>Selecciona tu rol</Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            backgroundColor: "#f3f4f6",
            borderRadius: 999,
            padding: 4,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 999,
              alignItems: "center",
              backgroundColor: role === "user" ? "white" : "transparent",
            }}
            onPress={() => setRole("user")}
          >
            <Text
              style={{
                color: role === "user" ? "#111827" : "#6b7280",
                fontWeight: role === "user" ? "600" : "400",
              }}
            >
              Usuario
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 999,
              alignItems: "center",
              backgroundColor: role === "admin" ? "white" : "transparent",
            }}
            onPress={() => setRole("admin")}
          >
            <Text
              style={{
                color: role === "admin" ? "#111827" : "#6b7280",
                fontWeight: role === "admin" ? "600" : "400",
              }}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 8 }}>
          <Button title="Ingresar" onPress={handleLogin} />
        </View>
      </View>
    </View>
  );
}
