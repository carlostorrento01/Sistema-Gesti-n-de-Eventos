import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  getEvents,
  deleteEvent,
  computeEventStats,
  type Event,
} from "../../../services/eventStorage";
import { useAuth } from "../../../contexts/AuthContext";

function getEventDate(e: Event): Date | null {
  if (!e.date) return null;
  const parts = e.date.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function EventosAdminList() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login" as any);
    } else if (user.role !== "admin") {
      router.replace("/eventos" as any);
    }
  }, [user]);

  const load = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    await load();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login" as any);
  };

  const totalEvents = events.length;

  const upcoming = events.filter((e) => {
    const date = getEventDate(e);
    if (!date) return false;
    return date >= new Date();
  }).length;

  const finished = events.filter((e) => {
    const date = getEventDate(e);
    if (!date) return false;
    return date < new Date();
  }).length;

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      {/* Header */}
      <View style={{ paddingTop: 40, paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>Administrador</Text>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {user?.name ?? "Admin"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#f87171",
            }}
          >
            <Text style={{ color: "#fecaca", fontSize: 12 }}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: "#e5e7eb", marginTop: 8 }}>
          Gestión completa de eventos y estadísticas
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
        {/* Resumen */}
        <View
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Text style={{ color: "white" }}>Total eventos: {totalEvents}</Text>
          <Text style={{ color: "white" }}>Próximos: {upcoming}</Text>
          <Text style={{ color: "white" }}>Finalizados: {finished}</Text>
        </View>

        {/* Botón crear */}
        <TouchableOpacity
          onPress={() => router.push("/admin/eventos/form" as any)}
          style={{
            backgroundColor: "#3b82f6",
            padding: 12,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Crear evento
          </Text>
        </TouchableOpacity>

        {/* Lista */}
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ color: "#9ca3af" }}>No hay eventos.</Text>
          }
          renderItem={({ item }) => {
            const date = getEventDate(item);
            const isPast = date ? date < new Date() : false;
            const stats = computeEventStats(item);

            return (
              <View
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#334155",
                }}
              >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text style={{ color: "#9ca3af" }}>
                  {item.date} • {item.time}
                </Text>
                <Text style={{ color: "#cbd5e1" }}>{item.location}</Text>

                <Text style={{ color: "#94a3b8", marginTop: 6 }}>
                  Estado: {isPast ? "Finalizado" : "Próximo"}
                </Text>

                <Text style={{ color: "#94a3b8" }}>
                  Asistentes: {stats.totalConfirmed} | ⭐ {stats.avgRating.toFixed(1)}
                </Text>

                {/* Botones */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#38bdf8",
                      padding: 8,
                      borderRadius: 8,
                      width: "32%",
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/admin/eventos/form",
                        params: { id: item.id },
                      } as any)
                    }
                  >
                    <Text
                      style={{ color: "black", fontWeight: "bold", textAlign: "center" }}
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#a855f7",
                      padding: 8,
                      borderRadius: 8,
                      width: "32%",
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/admin/historial/[id]",
                        params: { id: item.id },
                      } as any)
                    }
                  >
                    <Text
                      style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
                    >
                      Stats
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#ef4444",
                      padding: 8,
                      borderRadius: 8,
                      width: "32%",
                    }}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text
                      style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
                    >
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
