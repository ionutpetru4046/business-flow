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
  Scheduled: "bg-blue-200/70 text-blue-700 border-blue-200/50",
  "In Progress": "bg-yellow-100/80 text-yellow-700 border-yellow-100/60",
  Completed: "bg-green-200/80 text-green-700 border-green-200/60",
  Cancelled: "bg-neutral-200/70 text-gray-500 border-neutral-200/70",
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
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-300 via-white to-pink-200">
        <div className="bg-white/60 backdrop-blur-3xl shadow-2xl rounded-3xl px-10 py-14 max-w-xs sm:max-w-md flex flex-col items-center">
          <div className="animate-spin w-16 h-16 rounded-full border-4 border-indigo-300 border-b-transparent mb-7" />
          <p className="text-xl text-gray-600 font-semibold tracking-tight">Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-200 via-white to-pink-100 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 px-2 sm:px-5 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto bg-white/70 backdrop-blur-xl shadow-2xl rounded-none sm:rounded-b-3xl border-b border-indigo-100/30">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <span className="bg-gradient-to-br from-indigo-300 via-blue-100 to-violet-100 shadow-lg rounded-full p-2 sm:p-3 border border-indigo-100">
            <HiOutlineUser size={34} className="text-indigo-600" />
          </span>
          <div>
            <p className="font-bold text-indigo-800 text-base sm:text-lg leading-5">Welcome,</p>
            <span className="text-sm sm:text-base text-gray-500">{userEmail}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-0 flex items-center gap-2 cursor-pointer bg-gradient-to-br from-rose-100 to-rose-300 text-rose-700 px-4 sm:px-7 py-2 rounded-xl shadow-neutral-100 shadow-[0_3px_15px_0] transition hover:scale-105 hover:bg-rose-200 focus-visible:outline-2 focus-visible:ring-2 duration-200 font-semibold border border-rose-200"
        >
          <HiOutlineLogout size={22} />
          <span className="whitespace-nowrap">Logout</span>
        </button>
      </nav>

      {/* Header */}
      <section className="flex-1 px-2 sm:px-8 py-8 sm:py-14 max-w-7xl mx-auto w-full flex flex-col">
        <div className="mb-10 sm:mb-14 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 via-blue-400 to-violet-400 mb-3 sm:mb-5 tracking-tight drop-shadow-xl animate-fadein">
            CRM Dashboard
          </h1>
          <p className="text-base sm:text-xl text-gray-500 font-medium">
            Real-time overview of your business health
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 mb-9 sm:mb-14 w-full">
          {/* Customers */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center gap-3 border-t-4 border-indigo-300 hover:scale-105 hover:z-10 transition-all duration-200 hover:border-indigo-400/70 hover:shadow-2xl group">
            <div className="bg-gradient-to-br from-indigo-400 via-indigo-200 to-blue-100 rounded-xl p-3 shadow-lg">
              <HiOutlineUserGroup className="text-3xl md:text-4xl text-indigo-700 group-hover:scale-125 group-hover:text-indigo-900 transition" />
            </div>
            <div className="text-center">
              <p className="text-sm md:text-base font-semibold text-indigo-500 mb-1">Total Customers</p>
              <p className="text-3xl md:text-4xl font-extrabold text-indigo-900 drop-shadow-sm tracking-wider">{stats.totalCustomers}</p>
            </div>
          </div>
          {/* Appointments */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center gap-3 border-t-4 border-blue-300 hover:scale-105 hover:z-10 transition-all duration-200 hover:border-blue-400/60 hover:shadow-2xl group">
            <div className="bg-gradient-to-br from-blue-400 via-blue-100 to-blue-50 rounded-xl p-3 shadow-lg">
              <HiOutlineCalendar className="text-3xl md:text-4xl text-blue-700 group-hover:scale-125 group-hover:text-blue-900 transition" />
            </div>
            <div className="text-center">
              <p className="text-sm md:text-base font-semibold text-blue-500 mb-1">Total Appointments</p>
              <p className="text-3xl md:text-4xl font-extrabold text-blue-900 drop-shadow-sm tracking-wider">{stats.totalAppointments}</p>
            </div>
          </div>
          {/* Vehicles */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center gap-3 border-t-4 border-emerald-300 hover:scale-105 hover:z-10 transition-all duration-200 hover:border-emerald-400/70 hover:shadow-2xl group">
            <div className="bg-gradient-to-br from-green-300 via-emerald-100 to-emerald-50 rounded-xl p-3 shadow-lg">
              <HiOutlineTruck className="text-3xl md:text-4xl text-emerald-700 group-hover:scale-125 group-hover:text-emerald-900 transition" />
            </div>
            <div className="text-center">
              <p className="text-sm md:text-base font-semibold text-emerald-500 mb-1">Total Vehicles</p>
              <p className="text-3xl md:text-4xl font-extrabold text-emerald-900 drop-shadow-sm tracking-wider">{stats.totalVehicles}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Content Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 sm:gap-10 mb-12 sm:mb-16 transition-all w-full">
          {/* Appointments by Status */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-6 sm:p-9 border border-indigo-100/40 hover:shadow-2xl transition duration-200 animate-fadein">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-5 sm:mb-7 tracking-tight flex items-center gap-2">
              <HiOutlineCalendar className="text-xl text-indigo-400" />
              Appointments by Status
            </h2>
            <div className="space-y-3 sm:space-y-5">
              {STATUS_LABELS.map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-indigo-50/70 transition-all duration-150 group"
                >
                  <span
                    className={`px-4 py-1.5 rounded-full text-base font-semibold border ${STATUS_COLORS[status]} shadow-sm group-hover:scale-105 transition`}
                  >
                    {status}
                  </span>
                  <span className="text-2xl font-extrabold text-indigo-800 tracking-wide group-hover:text-indigo-500 transition-all duration-200">
                    {stats.appointmentsByStatus[status] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-6 sm:p-9 border border-blue-100/30 hover:shadow-2xl transition duration-200 animate-fadein">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-5 sm:mb-7 flex items-center gap-2 tracking-tight">
              <HiOutlineClock className="text-indigo-400" />
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <div className="h-36 flex flex-col justify-center items-center">
                <p className="text-gray-300 text-base text-center font-medium">
                  No upcoming appointments.
                </p>
                <div className="w-12 h-0.5 bg-indigo-100 mt-4 rounded" />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {upcomingAppointments.map((app, i) => (
                  <div
                    key={app.id}
                    className={`border ${STATUS_COLORS[app.status] || STATUS_COLORS.Scheduled} shadow-xs bg-white/95 rounded-xl p-5 flex flex-col gap-1
                    hover:border-indigo-400 hover:scale-[1.01] transition-all duration-150`}
                    style={{ animationDelay: `${i * 75}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-indigo-900 text-base sm:text-lg truncate">{app.title}</p>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs sm:text-sm font-semibold border bg-opacity-80 ${STATUS_COLORS[app.status] ?? STATUS_COLORS.Scheduled} shadow`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium truncate">
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

        {/* Manage Customers Button */}
        <div className="flex justify-center mt-6">
          <Link
            href="/customers"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-7 py-4 rounded-2xl shadow-lg font-semibold text-base md:text-lg transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-indigo-300 focus-visible:outline-2 focus-visible:ring-2"
          >
            <HiOutlineUserGroup size={22} />
            <span>Manage Customers</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-5 sm:p-6 text-center text-gray-400 text-sm sm:text-base mt-auto font-medium bg-white/70 backdrop-blur-xl w-full border-t border-indigo-100/30">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
          CRM Modern
        </span>
        . All rights reserved.
      </footer>
      <style jsx global>{`
        @keyframes fadein {
          from { opacity:0; transform: translateY(24px);}
          to { opacity:1; transform: translateY(0);}
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.61,1,.88,1) both;
        }
      `}</style>
    </main>
  );
}
