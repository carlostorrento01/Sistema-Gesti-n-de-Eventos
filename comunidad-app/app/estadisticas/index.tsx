import React from "react";
import { View, Text } from "react-native";

export default function StatsScreen() {
  // Datos simulados para mantenerlo básico
  const totalEventos = 10;
  const totalAsistencias = 35;
  const promedioComentariosPorEvento = 4;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Estadísticas
      </Text>

      <Text>Total de eventos realizados: {totalEventos}</Text>
      <Text>Total de asistencias registradas: {totalAsistencias}</Text>
      <Text>
        Promedio de comentarios por evento: {promedioComentariosPorEvento}
      </Text>

      <Text style={{ marginTop: 24, fontStyle: "italic" }}>
        * Nota: estos datos son simulados. En una versión con backend,
        aquí se mostrarían datos reales de la participación.
      </Text>
    </View>
  );
}
