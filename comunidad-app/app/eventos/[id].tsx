import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getEventById,
  confirmAttendance,
  addCommentToEvent,
  computeEventStats,
  type Event,
} from "../../services/eventStorage";
import { useAuth } from "../../contexts/AuthContext";

export default function DetalleEventoUsuario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [ratingText, setRatingText] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const ev = await getEventById(id);
      setEvent(ev);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading || !event) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0f172a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Cargando evento...</Text>
      </View>
    );
  }

  const now = new Date();
  const [y, m, d] = event.date.split("-").map(Number);
  const eventDate = new Date(y, m - 1, d);
  eventDate.setHours(0, 0, 0, 0);
  const isPast =
    eventDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const userAttendance = user
    ? event.attendees.find((a) => a.userId === user.id)
    : undefined;

  const handleConfirm = async () => {
    if (!user) {
      alert("Debes iniciar sesión.");
      return;
    }
    const updated = await confirmAttendance(event.id, user);
    if (updated) setEvent(updated);
  };

  const handleSendComment = async () => {
    if (!user) {
      alert("Debes iniciar sesión.");
      return;
    }
    if (!userAttendance) {
      alert("Solo los asistentes pueden dejar comentarios.");
      return;
    }
    const rating = Number(ratingText);
    if (!rating || rating < 1 || rating > 5) {
      alert("Calificación debe ser un número entre 1 y 5");
      return;
    }
    if (!commentText.trim()) {
      alert("Escribe un comentario");
      return;
    }

    const updated = await addCommentToEvent(
      event.id,
      user,
      rating,
      commentText.trim()
    );
    if (updated) {
      setEvent(updated);
      setCommentText("");
      setRatingText("");
    }
  };

  const stats = computeEventStats(event);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f172a" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View
        style={{
          backgroundColor: "#020617",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#1f2937",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            marginBottom: 4,
          }}
        >
          {event.name}
        </Text>
        <Text style={{ color: "#9ca3af" }}>
          {event.date} • {event.time}
        </Text>
        <Text style={{ color: "#d1d5db", marginTop: 4 }}>
          {event.location}
        </Text>
        <Text style={{ color: "#e5e7eb", marginTop: 8 }}>
          {event.description}
        </Text>

        <Text style={{ marginTop: 8, color: "#9ca3af", fontStyle: "italic" }}>
          Asistentes confirmados: {stats.totalConfirmed}
        </Text>

        <View style={{ marginTop: 12 }}>
          <Button
            title={
              isPast
                ? "Evento finalizado"
                : userAttendance
                ? "Asistencia confirmada ✔"
                : "Confirmar asistencia"
            }
            onPress={handleConfirm}
            disabled={isPast || !!userAttendance}
          />
        </View>
      </View>

      {/* Comentarios y calificaciones */}
      <View
        style={{
          backgroundColor: "#020617",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#1f2937",
          marginBottom: 16,
        }}
      >
        <Text
          style={{ fontWeight: "bold", color: "white", marginBottom: 4 }}
        >
          Opiniones
        </Text>
        <Text style={{ color: "#e5e7eb", marginBottom: 8 }}>
          Promedio: {stats.avgRating.toFixed(1)} ⭐
        </Text>

        {userAttendance && !isPast && (
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{ fontWeight: "bold", color: "#e5e7eb", marginBottom: 4 }}
            >
              Dejar comentario
            </Text>
            <Text style={{ color: "#d1d5db" }}>Calificación (1–5)</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#374151",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
                color: "white",
              }}
              value={ratingText}
              onChangeText={setRatingText}
              keyboardType="numeric"
            />
            <Text style={{ color: "#d1d5db" }}>Comentario</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#374151",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
                minHeight: 60,
                color: "white",
              }}
              multiline
              value={commentText}
              onChangeText={setCommentText}
            />
            <Button title="Enviar opinión" onPress={handleSendComment} />
          </View>
        )}

        <FlatList
          data={event.comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#374151",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "#e5e7eb", fontWeight: "600" }}>
                {item.userName} • {item.rating} ⭐
              </Text>
              <Text style={{ color: "#d1d5db" }}>{item.text}</Text>
              <Text style={{ fontSize: 12, color: "#9ca3af" }}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#9ca3af" }}>No hay comentarios todavía.</Text>
          }
        />
      </View>
    </ScrollView>
  );
}
