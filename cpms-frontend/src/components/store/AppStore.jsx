import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const StoreContext = createContext(null);
const LS_KEY = "ecobuild_frontend_store_v1";

export const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const seed = () => {
  const now = Date.now();

  return {
    projects: [
      {
        id: 1,
        name: "Riverside Apartments Complex",
        customer: "Lanka Builders",
        location: "Badulla",
        description: "Residential multi-unit development",
        startDate: "2025-12-10",
        status: "Planning",
      },
      {
        id: 2,
        name: "Green Valley Shopping Center",
        customer: "GV Holdings",
        location: "Kandy",
        description: "Retail construction and parking",
        startDate: "2025-11-02",
        status: "Construction",
      },
    ],

    tasks: [
      {
        id: 1,
        name: "Review architectural plans",
        location: "Badulla",
        description: "Check revisions and approvals",
        dueDate: todayISO(),
        assignedWorker: "Kasun",
        role: "Supervisor",
        status: "In Progress",
      },
      {
        id: 2,
        name: "Submit material order forms",
        location: "Kandy",
        description: "Order cement + steel",
        dueDate: "pending",
        assignedWorker: "Nimal",
        role: "Procurement",
        status: "Not Started",
      },
    ],

    appointments: [
      {
        id: 1,
        title: "Client Meeting - Project Review",
        dateTime: "2026-01-16T15:00",
        location: "Conference Room A",
      },
      {
        id: 2,
        title: "Site Visit - Foundation Inspection",
        dateTime: "2026-01-17T10:00",
        location: "Riverside Site",
      },
    ],

    // notifications
    messages: [
      {
        id: 1,
        text: "New task assigned: Review architectural plans",
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        id: 2,
        text: "Meeting scheduled for tomorrow 2:00 PM",
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        read: false,
      },
      {
        id: 3,
        text: "Task completed: Material inspection approved",
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        read: true,
      },
    ],

    // conversations list
    conversations: [
      {
        id: 1,
        title: "Riverside Apartments Project",
        kind: "project", // project | customer | admin
        subtitle: "Active now",
        unread: 2,
        lastMessageAt: new Date(now - 10 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        title: "Sarah Johnson (Customer)",
        kind: "customer",
        subtitle: "Can we discuss the timeline...",
        unread: 1,
        lastMessageAt: new Date(now - 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        title: "Admin Support",
        kind: "admin",
        subtitle: "Your request has been approved",
        unread: 0,
        lastMessageAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],

    // chat messages
    chatMessages: [
      {
        id: 101,
        conversationId: 1,
        sender: "them", // them | me
        senderLabel: "Project Team",
        text: "Good morning! The foundation work is progressing well.",
        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 102,
        conversationId: 1,
        sender: "me",
        senderLabel: "You",
        text: "Great to hear! What about the material delivery?",
        createdAt: new Date(now - 60 * 60 * 1000).toISOString(),
      },
      {
        id: 103,
        conversationId: 1,
        sender: "them",
        senderLabel: "Project Team",
        text: "Materials are scheduled to arrive by end of day.",
        createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      },
      {
        id: 201,
        conversationId: 2,
        sender: "them",
        senderLabel: "Customer",
        text: "Hi, can we discuss the updated timeline?",
        createdAt: new Date(now - 70 * 60 * 1000).toISOString(),
      },
    ],

    profile: {
      photoDataUrl: "",
      firstName: "Chamika",
      lastName: "",
      role: "Staff",
      email: "chamika@example.com",
      residence: "Sri Lanka",
      contact: "",
      birth: "2003-10-11",
    },

    tasksView: "today",
  };
};

function loadStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    return { ...seed(), ...parsed };
  } catch {
    return seed();
  }
}

export function AppStoreProvider({ children }) {
  const [data, setData] = useState(loadStore);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  const api = useMemo(() => {
    // Projects
    const addProject = (p) =>
      setData((d) => ({
        ...d,
        projects: [{ ...p, id: Date.now() }, ...d.projects],
      }));

    const updateProject = (id, patch) =>
      setData((d) => ({
        ...d,
        projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));

    const deleteProject = (id) =>
      setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));

    // Tasks
    const addTask = (t) =>
      setData((d) => ({
        ...d,
        tasks: [{ ...t, id: Date.now() }, ...d.tasks],
      }));

    const updateTask = (id, patch) =>
      setData((d) => ({
        ...d,
        tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }));

    const deleteTask = (id) =>
      setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));

    // Appointments
    const addAppointment = (a) =>
      setData((d) => ({
        ...d,
        appointments: [{ ...a, id: Date.now() }, ...d.appointments],
      }));

    const updateAppointment = (id, patch) =>
      setData((d) => ({
        ...d,
        appointments: d.appointments.map((a) =>
          a.id === id ? { ...a, ...patch } : a
        ),
      }));

    const deleteAppointment = (id) =>
      setData((d) => ({
        ...d,
        appointments: d.appointments.filter((a) => a.id !== id),
      }));

    // Notifications
    const markMessageRead = (id) =>
      setData((d) => ({
        ...d,
        messages: d.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
      }));

    const markAllMessagesRead = () =>
      setData((d) => ({
        ...d,
        messages: d.messages.map((m) => ({ ...m, read: true })),
      }));

    // Chat
    const sendMessage = (conversationId, text) =>
      setData((d) => {
        const now = new Date().toISOString();

        return {
          ...d,
          chatMessages: [
            ...(d.chatMessages || []),
            {
              id: Date.now(),
              conversationId,
              sender: "me",
              senderLabel: "You",
              text,
              createdAt: now,
            },
          ],
          conversations: (d.conversations || []).map((c) =>
            c.id === conversationId ? { ...c, subtitle: text, lastMessageAt: now } : c
          ),
        };
      });

    const markConversationRead = (conversationId) =>
      setData((d) => {
        let changed = false;

        const conversations = (d.conversations || []).map((c) => {
          if (c.id === conversationId && c.unread !== 0) {
            changed = true;
            return { ...c, unread: 0 };
          }
          return c;
        });

        return changed ? { ...d, conversations } : d;
      });

    // Profile
    const updateProfile = (patch) =>
      setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

    // Tasks view
    const setTasksView = (view) => setData((d) => ({ ...d, tasksView: view }));

    return {
      data,

      addProject,
      updateProject,
      deleteProject,

      addTask,
      updateTask,
      deleteTask,

      addAppointment,
      updateAppointment,
      deleteAppointment,

      // notifications
      markMessageRead,
      markAllMessagesRead,

      // chat
      sendMessage,
      markConversationRead,

      updateProfile,
      setTasksView,
      todayISO,
    };
  }, [data]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
