"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineTruck,
  HiOutlineClock,
} from "react-icons/hi";

type DashboardStats = {
  totalCustomers: number;
  totalAppointments: number;
  totalVehicles: number;
  appointmentsByStatus: Record<string, number>;
};

type UpcomingAppointment = {
  id: string;
  title: string;
  appointment_date: string;
  status: string;
  customers: { name: string } | null;
};

const STATUS_LABELS = ["Scheduled", "In Progress", "Completed", "Cancelled"] as const;

const STATUS_COLORS: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalAppointments: 0,
    totalVehicles: 0,
    appointmentsByStatus: {},
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    UpcomingAppointment[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email || "");

      const [
        customersResult,
        appointmentsResult,
        vehiclesResult,
        upcomingResult,
      ] = await Promise.all([
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("appointments").select("status"),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select("id, title, appointment_date, status, customers(name)")
          .gte("appointment_date", new Date().toISOString())
          .neq("status", "Cancelled")
          .order("appointment_date", { ascending: true })
          .limit(5),
      ]);

      const appointmentsByStatus: Record<string, number> = {};
      for (const label of STATUS_LABELS) {
        appointmentsByStatus[label] = 0;
      }
      for (const row of appointmentsResult.data ?? []) {
        const status = row.status ?? "Scheduled";
        appointmentsByStatus[status] = (appointmentsByStatus[status] ?? 0) + 1;
      }

      setStats({
        totalCustomers: customersResult.count ?? 0,
        totalAppointments: appointmentsResult.data?.length ?? 0,
        totalVehicles: vehiclesResult.count ?? 0,
        appointmentsByStatus,
      });

      setUpcomingAppointments(
        (upcomingResult.data as UpcomingAppointment[] | null) ?? []
      );
      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-indigo-50">
        <div className="bg-white shadow-lg rounded-xl px-10 py-10 w-full max-w-md flex flex-col items-center">
          <p className="text-lg text-gray-600">Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-indigo-50 flex flex-col">
      <nav className="p-6 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
        <div className="flex items-center gap-3">
          <span className="text-indigo-600 bg-indigo-100 rounded-full p-2">
            <HiOutlineUser size={28} />
          </span>
          <div>
            <p className="font-medium text-indigo-900">Welcome</p>
            <span className="text-sm text-gray-500">{userEmail}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow transition hover:bg-red-100"
        >
          <HiOutlineLogout size={20} />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </nav>

      <section className="flex-1 px-4 py-10 max-w-5xl mx-auto w-full">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 tracking-tight">
            CRM Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Real-time overview of your business
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="bg-indigo-100 rounded-xl p-3">
              <HiOutlineUserGroup className="text-2xl text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-3xl font-extrabold text-indigo-900">
                {stats.totalCustomers}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="bg-blue-100 rounded-xl p-3">
              <HiOutlineCalendar className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-3xl font-extrabold text-indigo-900">
                {stats.totalAppointments}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="bg-emerald-100 rounded-xl p-3">
              <HiOutlineTruck className="text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <p className="text-3xl font-extrabold text-indigo-900">
                {stats.totalVehicles}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-indigo-900 mb-4">
              Appointments by Status
            </h2>
            <div className="space-y-3">
              {STATUS_LABELS.map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[status]}`}
                  >
                    {status}
                  </span>
                  <span className="text-lg font-bold text-indigo-900">
                    {stats.appointmentsByStatus[status] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <HiOutlineClock className="text-indigo-500" />
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No upcoming appointments.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="border border-indigo-100 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-indigo-900">
                        {app.title}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[app.status] ?? STATUS_COLORS.Scheduled}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {app.customers?.name ?? "Unknown customer"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(app.appointment_date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/customers"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow font-semibold text-lg transition"
          >
            <HiOutlineUserGroup size={22} />
            Manage Customers
          </Link>
        </div>
      </section>

      <footer className="p-5 text-center text-gray-400 text-sm mt-auto">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-bold text-indigo-500">CRM Modern</span>. All
        rights reserved.
      </footer>
    </main>
  );
}
