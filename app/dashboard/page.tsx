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

/*
MODERN, BEAUTIFUL DESIGN LANGUAGE
- Vibrant gradients, subtle glassmorphism, frosted backgrounds
- Soft drop shadows, smooth hover states, animated button/element feedback
- Clean, ample spacing and rounded corners
- Consistent modern fonts, color palette, lighter UI
*/

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
  Scheduled: "bg-blue-200/80 text-blue-700",
  "In Progress": "bg-amber-100/90 text-amber-700",
  Completed: "bg-green-200/80 text-green-700",
  Cancelled: "bg-neutral-200/70 text-gray-600",
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
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);

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
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-2xl px-12 py-12 max-w-md flex flex-col items-center">
          <div className="animate-pulse w-12 h-12 rounded-full border-4 border-indigo-300 mb-6" />
          <p className="text-lg text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white via-30% to-purple-200 font-sans">
      <nav className="sticky top-0 z-20 p-7 flex items-center justify-between bg-white/70 backdrop-blur-xl shadow-lg rounded-b-3xl mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-4">
          <span className="text-indigo-700 bg-gradient-to-br from-indigo-200 via-indigo-100 to-emerald-100 shadow-inner rounded-full p-3 border-2 border-indigo-200/60">
            <HiOutlineUser size={32} />
          </span>
          <div>
            <p className="font-semibold text-indigo-900 text-lg">Welcome,</p>
            <span className="text-base text-gray-500">{userEmail}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-rose-100 to-red-200 text-red-700 px-6 py-2 rounded-xl shadow transition hover:scale-105 hover:bg-rose-200 duration-200 font-semibold outline-none border border-red-100"
        >
          <HiOutlineLogout size={22} />
          <span>Logout</span>
        </button>
      </nav>

      <section className="flex-1 px-4 sm:px-8 py-12 max-w-6xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-indigo-400 to-blue-400 mb-4 tracking-tight drop-shadow-lg">
            CRM Dashboard
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Real-time overview of your business
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 flex flex-col items-center gap-4 border-t-4 border-indigo-400/30 hover:scale-[1.03] transition-all duration-200 hover:shadow-2xl">
            <div className="bg-gradient-to-br from-indigo-400 via-indigo-300 to-indigo-100 rounded-2xl p-4 shadow">
              <HiOutlineUserGroup className="text-3xl text-indigo-800" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-indigo-500 mb-1">Total Customers</p>
              <p className="text-4xl font-extrabold text-indigo-900 drop-shadow">{stats.totalCustomers}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 flex flex-col items-center gap-4 border-t-4 border-blue-400/30 hover:scale-[1.03] transition-all duration-200 hover:shadow-2xl">
            <div className="bg-gradient-to-br from-blue-400 via-blue-200 to-blue-50 rounded-2xl p-4 shadow">
              <HiOutlineCalendar className="text-3xl text-blue-700" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-blue-500 mb-1">Total Appointments</p>
              <p className="text-4xl font-extrabold text-indigo-900 drop-shadow">{stats.totalAppointments}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 flex flex-col items-center gap-4 border-t-4 border-green-400/30 hover:scale-[1.03] transition-all duration-200 hover:shadow-2xl">
            <div className="bg-gradient-to-br from-green-300 via-emerald-200 to-emerald-50 rounded-2xl p-4 shadow">
              <HiOutlineTruck className="text-3xl text-emerald-700" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-emerald-500 mb-1">Total Vehicles</p>
              <p className="text-4xl font-extrabold text-indigo-900 drop-shadow">{stats.totalVehicles}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Appointments by Status Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-indigo-100/40 hover:shadow-2xl transition duration-200">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6 tracking-tight flex items-center gap-2">
              <HiOutlineCalendar className="text-xl text-indigo-500" />
              Appointments by Status
            </h2>
            <div className="space-y-4">
              {STATUS_LABELS.map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-indigo-50/50 transition group"
                >
                  <span
                    className={`px-4 py-1.5 rounded-full text-base font-semibold ${STATUS_COLORS[status]} shadow-sm group-hover:scale-105  transition`}
                  >
                    {status}
                  </span>
                  <span className="text-2xl font-extrabold text-indigo-800 tracking-wide group-hover:text-indigo-600 transition">
                    {stats.appointmentsByStatus[status] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-blue-100/30 hover:shadow-2xl transition duration-200">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2 tracking-tight">
              <HiOutlineClock className="text-indigo-500" />
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <div className="h-36 flex flex-col justify-center items-center">
                <p className="text-gray-400 text-base text-center">
                  No upcoming appointments.
                </p>
                <div className="w-12 h-0.5 bg-indigo-100 mt-4 rounded" />
              </div>
            ) : (
              <div className="space-y-5">
                {upcomingAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="border border-indigo-100/60 shadow-sm bg-white/90 rounded-xl p-5 hover:scale-[1.02] hover:border-indigo-300 transition flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-indigo-900 text-lg">{app.title}</p>
                      <span
                        className={`px-3 py-0.5 rounded-full text-sm font-semibold ${STATUS_COLORS[app.status] ?? STATUS_COLORS.Scheduled} shadow`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-base text-gray-600 font-medium">
                      {app.customers?.name ?? "Unknown customer"}
                    </p>
                    <p className="text-xs text-indigo-400 mt-1 font-mono">
                      {new Date(app.appointment_date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/customers"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold text-lg transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-indigo-300"
          >
            <HiOutlineUserGroup size={24} />
            Manage Customers
          </Link>
        </div>
      </section>

      <footer className="p-6 text-center text-gray-400 text-base mt-auto font-medium bg-white/60 backdrop-blur-xl w-full border-t border-indigo-100/30">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
          CRM Modern
        </span>
        . All rights reserved.
      </footer>
    </main>
  );
}
