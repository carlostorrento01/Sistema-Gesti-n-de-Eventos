// services/eventStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "admin" | "user";

export type User = {
  id: string;
  name: string;
  role: UserRole;
};

export type AttendanceStatus = "confirmed" | "attended" | "no-show";

export type Attendance = {
  userId: string;
  userName: string;
  status: AttendanceStatus;
};

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  eventId: string;
  rating: number; // 1-5
  text: string;
  createdAt: string; // ISO
};

export type Event = {
  id: string;
  name: string;
  description: string;
  category?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  attendees: Attendance[];
  comments: Comment[];
};

const STORAGE_EVENTS = "@eventos";
const STORAGE_USER = "@currentUser";

// ---------- USUARIO ACTUAL ----------

export async function getCurrentUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(STORAGE_USER);
  if (!raw) return null;
  return JSON.parse(raw) as User;
}

export async function setCurrentUser(user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

export async function clearCurrentUser(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_USER);
}

// ---------- EVENTOS ----------

export async function getEvents(): Promise<Event[]> {
  const raw = await AsyncStorage.getItem(STORAGE_EVENTS);
  if (!raw) return [];
  return JSON.parse(raw) as Event[];
}

async function saveEvents(events: Event[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
}

export async function createEvent(
  data: Omit<Event, "id" | "attendees" | "comments">
): Promise<Event> {
  const events = await getEvents();
  const newEvent: Event = {
    ...data,
    id: Date.now().toString(),
    attendees: [],
    comments: [],
  };
  const updated = [...events, newEvent];
  await saveEvents(updated);
  return newEvent;
}

export async function updateEvent(
  eventId: string,
  data: Partial<Event>
): Promise<Event | null> {
  const events = await getEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return null;
  const updatedEvent: Event = { ...events[idx], ...data, id: events[idx].id };
  events[idx] = updatedEvent;
  await saveEvents(events);
  return updatedEvent;
}

export async function deleteEvent(eventId: string): Promise<void> {
  const events = await getEvents();
  const updated = events.filter((e) => e.id !== eventId);
  await saveEvents(updated);
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const events = await getEvents();
  return events.find((e) => e.id === eventId) ?? null;
}

// ---------- ASISTENCIA Y COMENTARIOS ----------

export async function confirmAttendance(
  eventId: string,
  user: User
): Promise<Event | null> {
  const events = await getEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return null;

  const event = events[idx];

  // Proteger por si alguna vez event.attendees vino undefined
  if (!Array.isArray(event.attendees)) {
    event.attendees = [];
  }

  const existingIndex = event.attendees.findIndex((a) => a.userId === user.id);

  const attendance: Attendance = {
    userId: user.id,
    userName: user.name,
    status: "confirmed",
  };

  if (existingIndex === -1) {
    event.attendees.push(attendance);
  } else {
    event.attendees[existingIndex] = attendance;
  }

  events[idx] = event;
  await saveEvents(events);
  return event;
}

export async function markAttendanceStatus(
  eventId: string,
  userId: string,
  status: AttendanceStatus
): Promise<Event | null> {
  const events = await getEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return null;
  const event = events[idx];

  if (!Array.isArray(event.attendees)) {
    event.attendees = [];
  }

  const attIdx = event.attendees.findIndex((a) => a.userId === userId);
  if (attIdx === -1) return null;

  event.attendees[attIdx].status = status;
  events[idx] = event;
  await saveEvents(events);
  return event;
}

export async function addCommentToEvent(
  eventId: string,
  user: User,
  rating: number,
  text: string
): Promise<Event | null> {
  const events = await getEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return null;
  const event = events[idx];

  if (!Array.isArray(event.comments)) {
    event.comments = [];
  }

  const comment: Comment = {
    id: Date.now().toString(),
    userId: user.id,
    userName: user.name,
    eventId,
    rating,
    text,
    createdAt: new Date().toISOString(),
  };

  event.comments.push(comment);
  events[idx] = event;
  await saveEvents(events);
  return event;
}

// ---------- UTILIDADES OPCIONALES ----------

export async function clearAllEvents(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_EVENTS);
}

// ---------- ESTADÍSTICAS ----------

export function computeEventStats(event: Event) {
  // Nos protegemos contra datos viejos que no tengan attendees/comments
  const attendees = Array.isArray((event as any).attendees)
    ? (event.attendees as Attendance[])
    : [];

  const comments = Array.isArray((event as any).comments)
    ? (event.comments as Comment[])
    : [];

  const totalConfirmed = attendees.length;
  const totalAttended = attendees.filter(
    (a) => a.status === "attended"
  ).length;

  const ratings = comments.map((c) => c.rating);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((acc, r) => acc + r, 0) / ratings.length
      : 0;

  return {
    totalConfirmed,
    totalAttended,
    avgRating,
  };
}
