import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getEventById, computeEventStats, type Event } from "../../../services/eventStorage";
import { useAuth } from "../../../contexts/AuthContext";

export default function EstadisticasAdmin() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") return;

    const load = async () => {
      const ev = await getEventById(id);
      setEvent(ev);
    };
    load();
  }, [id]);

  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Cargando...</Text>
      </View>
    );
  }

  const stats = computeEventStats(event);

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a", padding: 16 }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
        Estadísticas del evento
      </Text>
      <Text style={{ color: "#94a3b8", marginBottom: 16 }}>{event.name}</Text>

      {/* Tarjetas */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#1e293b",
            padding: 16,
            marginRight: 8,
            borderRadius: 12,
            borderColor: "#334155",
            borderWidth: 1,
          }}
        >
          <Text style={{ color: "#94a3b8" }}>Confirmados</Text>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {stats.totalConfirmed}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#1e293b",
            padding: 16,
            marginLeft: 8,
            borderRadius: 12,
            borderColor: "#334155",
            borderWidth: 1,
          }}
        >
          <Text style={{ color: "#94a3b8" }}>Promedio ⭐</Text>
          <Text style={{ color: "#facc15", fontSize: 20, fontWeight: "bold" }}>
            {stats.avgRating.toFixed(1)}
          </Text>
        </View>
      </View>

      <Text style={{ color: "#e5e7eb", marginBottom: 8, fontSize: 18, fontWeight: "bold" }}>
        Comentarios
      </Text>

      <FlatList
        data={event.comments}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={{ color: "#64748b" }}>Sin comentarios.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#1e293b",
              padding: 12,
              borderRadius: 12,
              marginBottom: 12,
              borderColor: "#334155",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {item.userName} • ⭐ {item.rating}
            </Text>
            <Text style={{ color: "#cbd5e1", marginVertical: 4 }}>{item.text}</Text>
            <Text style={{ color: "#64748b", fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
