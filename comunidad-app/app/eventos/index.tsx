import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import { getEvents, type Event } from "../../services/eventStorage";
import { useAuth } from "../../contexts/AuthContext";

export default function EventosUsuario() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login" as any);
  };

  const filtered = events.filter((e) =>
    [e.name, e.location, e.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0f172a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
        <Text style={{ color: "white", marginTop: 8 }}>
          Cargando eventos...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 40,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: "#0f172a",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>
              Bienvenido
            </Text>
            <Text
              style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
            >
              {user?.name ?? "Usuario"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#f97373",
            }}
          >
            <Text style={{ color: "#fecaca", fontSize: 12 }}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#e5e7eb", marginTop: 8 }}>
          Explora y participa en los eventos de tu comunidad
        </Text>
      </View>

      {/* Contenido */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#111827",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 16,
        }}
      >
        <TextInput
          placeholder="Buscar por nombre, ubicación o categoría"
          placeholderTextColor="#9ca3af"
          style={{
            borderWidth: 1,
            borderColor: "#374151",
            backgroundColor: "#020617",
            color: "white",
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 12,
          }}
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: "#020617",
                borderRadius: 12,
                padding: 12,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#1f2937",
              }}
              onPress={() =>
                router.push({
                  pathname: "/eventos/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 16,
                  marginBottom: 4,
                }}
              >
                {item.name}
              </Text>
              <Text style={{ color: "#9ca3af", marginBottom: 2 }}>
                {item.date} • {item.time}
              </Text>
              <Text style={{ color: "#d1d5db" }}>{item.location}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#9ca3af" }}>
              No hay eventos creados aún.
            </Text>
          }
        />
      </View>
    </View>
  );
}
