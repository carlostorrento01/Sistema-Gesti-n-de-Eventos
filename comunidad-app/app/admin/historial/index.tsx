import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getEvents, computeEventStats, type Event } from "../../../services/eventStorage";
import { useAuth } from "../../../contexts/AuthContext";

export default function HistorialAdmin() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!user) router.replace("/auth/login");
    else if (user.role !== "admin") router.replace("/eventos");
  }, [user]);

  useEffect(() => {
    const load = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    load();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a", padding: 16 }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
        Historial de Eventos
      </Text>
      <Text style={{ color: "#94a3b8", marginBottom: 16 }}>
        Revisa asistencia, comentarios y calificaciones
      </Text>

      <FlatList
        data={events}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={{ color: "#64748b" }}>No hay eventos aún.</Text>}
        renderItem={({ item }) => {
          const stats = computeEventStats(item);

          return (
            <TouchableOpacity
              style={{
                backgroundColor: "#1e293b",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#334155",
              }}
              onPress={() =>
                router.push({
                  pathname: "/admin/historial/[id]",
                  params: { id: item.id },
                } as any)
              }
            >
              <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
                {item.name}
              </Text>

              <Text style={{ color: "#9ca3af" }}>
                {item.date} • {item.time}
              </Text>

              <Text style={{ color: "#cbd5e1", marginTop: 6 }}>
                Asistentes: {stats.totalConfirmed}  
              </Text>

              <Text style={{ color: "#facc15" }}>
                ⭐ Promedio: {stats.avgRating.toFixed(1)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
