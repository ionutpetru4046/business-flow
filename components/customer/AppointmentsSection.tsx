"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  HiOutlineCalendar,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

type Appointment = {
  id: string;
  title: string;
  appointment_date: string;
  status: string;
};

type AppointmentsSectionProps = {
  customerId: string;
};

const STATUS_OPTIONS = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

function toDatetimeLocalValue(isoString: string): string {
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AppointmentsSection({ customerId }: AppointmentsSectionProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState(STATUS_OPTIONS[0]);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch appointments
  const loadAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("customer_id", customerId)
      .order("appointment_date", { ascending: true });

    setLoading(false);

    if (error) {
      console.error(error);
      setAppointments([]);
      return;
    }

    setAppointments(data ?? []);
  };

  useEffect(() => {
    if (customerId) {
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const resetAppointmentForm = () => {
    setEditingAppointmentId(null);
    setAppointmentTitle("");
    setAppointmentDate("");
    setAppointmentStatus(STATUS_OPTIONS[0]);
  };

  const handleSaveAppointment = async () => {
    if (!appointmentTitle || !appointmentDate) return;

    if (editingAppointmentId) {
      const { error } = await supabase
        .from("appointments")
        .update({
          title: appointmentTitle,
          appointment_date: appointmentDate,
          status: appointmentStatus,
        })
        .eq("id", editingAppointmentId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("appointments").insert([
        {
          customer_id: customerId,
          title: appointmentTitle,
          appointment_date: appointmentDate,
          status: appointmentStatus,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    resetAppointmentForm();
    await loadAppointments();
  };

  const handleEditAppointment = (appt: Appointment) => {
    setEditingAppointmentId(appt.id);
    setAppointmentTitle(appt.title);
    setAppointmentDate(toDatetimeLocalValue(appt.appointment_date));
    setAppointmentStatus(appt.status || STATUS_OPTIONS[0]);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    const confirmed = window.confirm("Delete this appointment?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId);

    if (error) {
      alert(error.message);
      return;
    }
    await loadAppointments();
    if (editingAppointmentId === appointmentId) {
      resetAppointmentForm();
    }
  };

  // Add handler for status update from the list
  const handleUpdateAppointmentStatus = async (id: string, newStatus: string) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt || appt.status === newStatus) return;

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }
    await loadAppointments();
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <HiOutlineCalendar className="text-xl" />
        Appointments
      </h2>

      <div className="bg-indigo-50 rounded-xl p-5 mb-6">
        <div className="grid gap-3 mb-3">
          <input
            type="text"
            placeholder="Appointment title"
            value={appointmentTitle}
            onChange={(e) => setAppointmentTitle(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <select
            value={appointmentStatus}
            onChange={(e) => setAppointmentStatus(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveAppointment}
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            type="button"
          >
            <HiOutlinePlusCircle />
            {editingAppointmentId ? "Save Changes" : "Add Appointment"}
          </button>
          {editingAppointmentId && (
            <button
              onClick={resetAppointmentForm}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-semibold"
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="py-8 text-center text-indigo-400 font-medium">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="py-8 text-center text-indigo-400 font-medium">No appointments yet.</div>
        ) : (
          <ul className="flex flex-col gap-5">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-lg text-indigo-900 mb-1">
                    {appt.title}
                  </div>
                  <div className="text-sm text-gray-500 mb-0.5">
                    {new Date(appt.appointment_date).toLocaleString()}
                  </div>
                  {/* Status update dropdown */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-1 rounded border ${STATUS_COLORS[appt.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}
                    >
                      {appt.status}
                    </span>
                    <select
                      value={appt.status}
                      onChange={(e) => handleUpdateAppointmentStatus(appt.id, e.target.value)}
                      className="ml-2 border border-indigo-200 rounded px-2 py-1 text-xs"
                      style={{ minWidth: 120 }}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEditAppointment(appt)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full focus:outline-none"
                    aria-label="Edit appointment"
                  >
                    <HiOutlinePencilSquare className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appt.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none"
                    aria-label="Delete appointment"
                  >
                    <HiOutlineTrash className="text-xl" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}