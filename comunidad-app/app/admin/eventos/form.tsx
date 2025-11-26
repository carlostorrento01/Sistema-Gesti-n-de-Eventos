import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createEvent,
  getEventById,
  updateEvent,
} from "../../../services/eventStorage";
import { useAuth } from "../../../contexts/AuthContext";

export default function EventoFormAdmin() {
  const router = useRouter();
  const { user } = useAuth();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  // 🔐 proteger pantalla
  useEffect(() => {
    if (!user) router.replace("/auth/login");
    if (user?.role !== "admin") router.replace("/eventos");
  }, [user]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const ev = await getEventById(id);
      if (ev) {
        setName(ev.name);
        setDescription(ev.description);
        setCategory(ev.category ?? "");
        setDate(ev.date);
        setTime(ev.time);
        setLocation(ev.location);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!name || !date || !time || !location) {
      alert("Nombre, fecha, hora y ubicación son obligatorios.");
      return;
    }

    if (isEdit && id) {
      await updateEvent(id, {
        name,
        description,
        category,
        date,
        time,
        location,
      });
    } else {
      await createEvent({
        name,
        description,
        category,
        date,
        time,
        location,
      });
    }

    router.replace("/admin/eventos");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f172a" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
        {isEdit ? "Editar evento" : "Crear nuevo evento"}
      </Text>

      <Text style={{ color: "#9ca3af", marginBottom: 16 }}>
        Completa los campos para guardar el evento
      </Text>

      {/* Campo */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "white", marginBottom: 4 }}>Nombre</Text>
        <TextInput
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 8,
            color: "white",
            padding: 10,
          }}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Descripción */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "white", marginBottom: 4 }}>Descripción</Text>
        <TextInput
          multiline
          style={{
            backgroundColor: "#1e293b",
            minHeight: 80,
            borderRadius: 8,
            color: "white",
            padding: 10,
            textAlignVertical: "top",
          }}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Categoría */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "white", marginBottom: 4 }}>Categoría</Text>
        <TextInput
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 8,
            color: "white",
            padding: 10,
          }}
          value={category}
          onChangeText={setCategory}
        />
      </View>

      {/* Fecha */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "white", marginBottom: 4 }}>Fecha (YYYY-MM-DD)</Text>
        <TextInput
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 8,
            color: "white",
            padding: 10,
          }}
          placeholder="2025-12-01"
          placeholderTextColor="#64748b"
          value={date}
          onChangeText={setDate}
        />
      </View>

      {/* Hora */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "white", marginBottom: 4 }}>Hora (HH:MM)</Text>
        <TextInput
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 8,
            color: "white",
            padding: 10,
          }}
          placeholder="18:00"
          placeholderTextColor="#64748b"
          value={time}
          onChangeText={setTime}
        />
      </View>

      {/* Ubicación */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "white", marginBottom: 4 }}>Ubicación</Text>
        <TextInput
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 8,
            color: "white",
            padding: 10,
          }}
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#3b82f6",
          padding: 14,
          borderRadius: 12,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Guardar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
