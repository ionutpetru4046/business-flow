"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { HiOutlineUser, HiOutlineLogout, HiOutlineUserGroup } from "react-icons/hi";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email || "");
      setLoading(false);
    };

    getUser();
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

      <section className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl py-14 px-10 max-w-xl mx-auto mt-16 w-full">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 text-center tracking-tight">
            CRM Dashboard
          </h1>
          <p className="mb-8 text-lg text-center text-gray-600">
            Streamline your customer management. Browse and manage customers easily!
          </p>
          <div className="flex gap-6 justify-center">
            <Link
              href="/customers"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow font-semibold text-lg transition"
            >
              <HiOutlineUserGroup size={22} />
              Customers
            </Link>
          </div>
        </div>
      </section>
      <footer className="p-5 text-center text-gray-400 text-sm mt-auto">
        &copy; {new Date().getFullYear()} <span className="font-bold text-indigo-500">CRM Modern</span>. All rights reserved.
      </footer>
    </main>
  );
}