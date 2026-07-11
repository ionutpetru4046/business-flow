"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlinePaperAirplane,
  HiOutlineCalendar,
  HiOutlineTrash,
  HiOutlineTruck,
  HiOutlinePlusCircle,
  HiOutlinePencilSquare,
  HiOutlineXCircle,
} from "react-icons/hi2";

import CustomerInfo from "@/components/customer/CustomerInfo";
import NotesSection from "@/components/customer/NotesSection";
import TasksSection from "@/components/customer/TasksSection";
import AppointmentsSection from "@/components/customer/AppointmentsSection";
import VehiclesSection from "@/components/customer/VehiclesSection";
import ServiceHistorySection from "@/components/customer/ServiceHistorySection";
import JobCardsSection from "@/components/customer/JobCardsSection";


type Note = {
  id: string;
  content: string;
  created_at: string;
};

type Appointment = {
  id: string;
  title: string;
  appointment_date: string;
  status: string;
};

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  vin: string | null;
  created_at: string;
};

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type ServiceRecord = {
  id: string;
  vehicle_id: string;
  service_name: string;
  service_date: string;
  cost: number | null;
  notes: string | null;
};

const APPOINTMENT_STATUSES = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

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

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleVin, setVehicleVin] = useState("");
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");

  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");

  // Service history fetching by customer vehicles
  const loadServiceHistory = useCallback(
    async (vehicleIds: string[]) => {
      if (vehicleIds.length === 0) {
        setServices([]);
        return;
      }
  
      const { data, error } = await supabase
        .from("service_history")
        .select("*")
        .in("vehicle_id", vehicleIds)
        .order("service_date", {
          ascending: false,
        });
  
      if (error) {
        console.error(
          "[loadServiceHistory] Error:",
          error
        );
  
        setServices([]);
        return;
      }
  
      setServices(data ?? []);
    },
    []
  );

  const loadCustomer = useCallback(async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setCustomer(data);
    setLoading(false);
  }, [id]);

  const loadNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setNotes(data ?? []);
  }, [id]);

  const loadAppointments = useCallback(async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("customer_id", id)
      .order("appointment_date", { ascending: true });

    if (error) {
      console.error(error);
      setAppointments([]);
      return;
    }

    setAppointments(data ?? []);
  }, [id]);

  // Load vehicles, and also trigger service history loading for those vehicles
  const loadVehicles = useCallback(async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setVehicles([]);
      setServices([]);
      return;
    }

    setVehicles(data ?? []);
    
    // Fetch service history for these vehicles
    if (data && data.length > 0) {
      const vIds = data.map((v: Vehicle) => v.id);
      await loadServiceHistory(vIds);
    } else {
      setServices([]);
    }
  }, [id, loadServiceHistory]);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setTasks(data ?? []);
  };

  const resetAppointmentForm = useCallback(() => {
    setEditingAppointmentId(null);
    setAppointmentTitle("");
    setAppointmentDate("");
  }, []);

  const handleSaveAppointment = useCallback(async () => {
    if (!appointmentTitle || !appointmentDate) return;

    if (editingAppointmentId) {
      const { error } = await supabase
        .from("appointments")
        .update({
          title: appointmentTitle,
          appointment_date: appointmentDate,
        })
        .eq("id", editingAppointmentId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("appointments").insert([
        {
          customer_id: id,
          title: appointmentTitle,
          appointment_date: appointmentDate,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    resetAppointmentForm();
    await loadAppointments();
  }, [
    appointmentTitle,
    appointmentDate,
    editingAppointmentId,
    id,
    loadAppointments,
    resetAppointmentForm,
  ]);

  const handleEditAppointment = useCallback((appointment: Appointment) => {
    setEditingVehicleId(null);
    setVehicleMake("");
    setVehicleModel("");
    setVehicleYear("");
    setVehiclePlate("");
    setVehicleVin("");
    setEditingAppointmentId(appointment.id);
    setAppointmentTitle(appointment.title);
    setAppointmentDate(toDatetimeLocalValue(appointment.appointment_date));
  }, []);

  const handleDeleteAppointment = useCallback(
    async (appointmentId: string) => {
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
    },
    [loadAppointments],
  );

  const handleAppointmentStatusChange = useCallback(
    async (appointmentId: string, status: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointmentId);

      if (error) {
        alert(error.message);
        return;
      }
      await loadAppointments();
    },
    [loadAppointments],
  );

  const resetVehicleForm = useCallback(() => {
    setEditingVehicleId(null);
    setVehicleMake("");
    setVehicleModel("");
    setVehicleYear("");
    setVehiclePlate("");
    setVehicleVin("");
  }, []);

  const handleSaveVehicle = useCallback(async () => {
    if (!vehicleMake.trim() || !vehicleModel.trim()) return;

    const payload = {
      make: vehicleMake.trim(),
      model: vehicleModel.trim(),
      year: vehicleYear ? parseInt(vehicleYear, 10) : null,
      license_plate: vehiclePlate.trim() || null,
      vin: vehicleVin.trim() || null,
    };

    if (editingVehicleId) {
      const { error } = await supabase
        .from("vehicles")
        .update(payload)
        .eq("id", editingVehicleId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("vehicles")
        .insert([{ customer_id: id, ...payload }]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    resetVehicleForm();
    await loadVehicles();
  }, [
    id,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehiclePlate,
    vehicleVin,
    editingVehicleId,
    loadVehicles,
    resetVehicleForm,
  ]);

  const handleEditVehicle = useCallback(
    (vehicle: Vehicle) => {
      resetAppointmentForm();
      setEditingVehicleId(vehicle.id);
      setVehicleMake(vehicle.make);
      setVehicleModel(vehicle.model);
      setVehicleYear(vehicle.year ? String(vehicle.year) : "");
      setVehiclePlate(vehicle.license_plate ?? "");
      setVehicleVin(vehicle.vin ?? "");
    },
    [resetAppointmentForm],
  );

  const handleDeleteVehicle = useCallback(
    async (vehicleId: string) => {
      const confirmed = window.confirm("Delete this vehicle?");
      if (!confirmed) return;

      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleId);

      if (error) {
        alert(error.message);
        return;
      }
      await loadVehicles();
    },
    [loadVehicles],
  );

  const handleAddNote = useCallback(async () => {
    if (!note.trim()) return;

    const { error } = await supabase.from("notes").insert([
      {
        customer_id: id,
        content: note,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNote("");
    await loadNotes();
  }, [id, note, loadNotes]);

  const createTask = async () => {
    if (!taskTitle.trim()) return;

    const { error } = await supabase.from("tasks").insert([
      {
        customer_id: id,
        title: taskTitle,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTaskTitle("");

    await loadTasks();
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        completed: !completed,
      })
      .eq("id", taskId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTasks();
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTasks();
  };

  // Note: add services to dependencies so loadServiceHistory is always current
  useEffect(() => {
    if (id) {
      loadCustomer();
      loadNotes();
      loadAppointments();
      loadVehicles();
      loadTasks();
      // Don't call loadServiceHistory directly here! Only call it when vehicles are loaded (done in loadVehicles)
    }
  }, [id, loadCustomer, loadNotes, loadAppointments, loadVehicles]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <div className="bg-white py-10 px-6 rounded-xl shadow-xl flex flex-col items-center w-full max-w-md">
          <p className="flex gap-2 items-center text-indigo-700 font-semibold text-lg animate-pulse">
            <HiOutlineUser className="text-2xl" /> Loading...
          </p>
        </div>
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <div className="bg-white py-10 px-6 rounded-xl shadow-xl flex flex-col items-center w-full max-w-md">
          <p className="text-red-700 text-lg font-bold">Customer not found.</p>
        </div>
      </main>
    );
  }

  // Service history grouping by vehicle (for display)
  const servicesByVehicle: { [vehicleId: string]: ServiceRecord[] } = {};
  vehicles.forEach((v) => {
    servicesByVehicle[v.id] = [];
  });
  services.forEach((service) => {
    if (servicesByVehicle[service.vehicle_id]) {
      servicesByVehicle[service.vehicle_id].push(service);
    }
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12">
      <div className="bg-white shadow-2xl rounded-3xl px-10 py-10 max-w-2xl w-full">
      <CustomerInfo customer={customer} />

        {/* Notes Section */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <HiOutlineDocumentText className="text-xl" />
            Notes
          </h2>

          <div className="bg-indigo-50 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note for this customer..."
                className="w-full border border-indigo-200 focus:border-indigo-400 ring-0 py-3 px-4 rounded-lg shadow-sm transition resize-none text-base bg-white focus:bg-indigo-50"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 px-3 rounded-lg shadow flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                disabled={!note.trim()}
                title="Add Note"
              >
                <HiOutlinePaperAirplane className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 pl-1">
              Keep track of important conversations and reminders here.
            </p>
          </div>

          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-6">
                No notes added yet.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white border border-indigo-100 rounded-xl p-4 shadow flex flex-col"
                >
                  <p className="text-indigo-900">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tasks Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="New Task"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button onClick={createTask} className="border px-4 py-2 rounded">
              Add
            </button>
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border p-3 rounded mb-2 flex justify-between"
            >
              <div>
                <p
                  className={task.completed ? "line-through text-gray-500" : ""}
                >
                  {task.title}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleTask(task.id, task.completed)}>
                  {task.completed ? "Undo" : "Done"}
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>

        {/* Appointments Section */}
        <section className="mt-12">
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
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveAppointment}
                disabled={!appointmentTitle || !appointmentDate}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow transition"
              >
                {editingAppointmentId ? (
                  <>
                    <HiOutlinePencilSquare className="w-5 h-5" />
                    Update Appointment
                  </>
                ) : (
                  <>
                    <HiOutlinePlusCircle className="w-5 h-5" />
                    Add Appointment
                  </>
                )}
              </button>
              {editingAppointmentId && (
                <button
                  onClick={resetAppointmentForm}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-200 transition"
                >
                  <HiOutlineXCircle className="w-5 h-5" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-6">
                No appointments yet.
              </div>
            ) : (
              appointments.map((app) => (
                <div
                  key={app.id}
                  className={`bg-white border rounded-xl p-4 shadow ${
                    editingAppointmentId === app.id
                      ? "border-indigo-400 ring-2 ring-indigo-100"
                      : "border-indigo-100"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-indigo-900">
                        {app.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(app.appointment_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditAppointment(app)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-semibold px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                        title="Edit appointment"
                      >
                        <HiOutlinePencilSquare className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(app.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition"
                        title="Delete appointment"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <label
                      htmlFor={`status-${app.id}`}
                      className="text-xs text-gray-500"
                    >
                      Status:
                    </label>
                    <select
                      id={`status-${app.id}`}
                      value={app.status}
                      onChange={(e) =>
                        handleAppointmentStatusChange(app.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${STATUS_COLORS[app.status] ?? STATUS_COLORS.Scheduled}`}
                    >
                      {APPOINTMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Vehicles Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <HiOutlineTruck className="text-xl" />
            Vehicles
          </h2>

          <div className="bg-indigo-50 rounded-xl p-5 mb-6">
            <div className="grid gap-3 md:grid-cols-2 mb-3">
              <input
                type="text"
                placeholder="Make (e.g. Toyota)"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
              />
              <input
                type="text"
                placeholder="Model (e.g. Camry)"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
              />
              <input
                type="number"
                placeholder="Year"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
              />
              <input
                type="text"
                placeholder="License plate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
              />
              <input
                type="text"
                placeholder="VIN (optional)"
                value={vehicleVin}
                onChange={(e) => setVehicleVin(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition md:col-span-2"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveVehicle}
                disabled={!vehicleMake.trim() || !vehicleModel.trim()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow transition"
              >
                {editingVehicleId ? (
                  <>
                    <HiOutlinePencilSquare className="w-5 h-5" />
                    Update Vehicle
                  </>
                ) : (
                  <>
                    <HiOutlinePlusCircle className="w-5 h-5" />
                    Add Vehicle
                  </>
                )}
              </button>
              {editingVehicleId && (
                <button
                  onClick={resetVehicleForm}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-200 transition"
                >
                  <HiOutlineXCircle className="w-5 h-5" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {vehicles.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-6">
                No vehicles registered yet.
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`bg-white border rounded-xl p-4 shadow flex items-start justify-between ${
                    editingVehicleId === vehicle.id
                      ? "border-indigo-400 ring-2 ring-indigo-100"
                      : "border-indigo-100"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-indigo-900">
                      {vehicle.make} {vehicle.model}
                      {vehicle.year ? ` (${vehicle.year})` : ""}
                    </p>
                    <div className="mt-1 space-y-0.5 text-sm text-gray-500">
                      {vehicle.license_plate && (
                        <p>Plate: {vehicle.license_plate}</p>
                      )}
                      {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditVehicle(vehicle)}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-semibold px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                      title="Edit vehicle"
                    >
                      <HiOutlinePencilSquare className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition"
                      title="Delete vehicle"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Service History Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <HiOutlineDocumentText className="text-xl" />
            Service History
          </h2>

          {vehicles.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-6">
              No vehicles registered yet.
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-indigo-800">
                    {vehicle.make} {vehicle.model}
                  </span>
                  {vehicle.year && (
                    <span className="text-xs text-gray-500">({vehicle.year})</span>
                  )}
                  {vehicle.license_plate && (
                    <span className="text-xs text-gray-500">
                      Plate: {vehicle.license_plate}
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto bg-indigo-50 rounded-xl">
                  <table className="min-w-full divide-y divide-indigo-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Service</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Cost</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicesByVehicle[vehicle.id] && servicesByVehicle[vehicle.id].length > 0 ? (
                        servicesByVehicle[vehicle.id].map((service) => (
                          <tr key={service.id} className="bg-white border-b border-indigo-100">
                            <td className="px-4 py-2">{service.service_name}</td>
                            <td className="px-4 py-2">{new Date(service.service_date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                              {service.cost != null ? (
                                <span>
                                  {service.cost.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="px-4 py-2">{service.notes || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                            No service history for this vehicle yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
