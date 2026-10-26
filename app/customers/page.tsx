"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineBuildingOffice2,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePlusCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";

// Add a glassmorphism overlay background
const premiumBg =
  "bg-gradient-to-tr from-indigo-100/80 via-white/80 to-fuchsia-100/70";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
};

export default function CustomersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setCustomers([]);
        return;
      }

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading customers:", error);
        setCustomers([]);
        return;
      }

      setCustomers(data ?? []);
    };

    load();
  }, []);

  const loadCustomers = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setCustomers([]);
      return;
    }

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
      return;
    }

    setCustomers(data ?? []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to manage customers.");
        return;
      }

      if (editingId) {
        const { error } = await supabase
          .from("customers")
          .update({
            name,
            email,
            phone,
            company,
          })
          .eq("id", editingId);

        if (error) {
          alert(error.message);
          return;
        }

        await loadCustomers();
        handleCancelEdit();
        alert("Customer updated!");
        return;
      }

      const { error } = await supabase.from("customers").insert([
        {
          name,
          email,
          phone,
          company,
          user_id: user.id,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }

      await loadCustomers();

      setName("");
      setEmail("");
      setPhone("");
      setCompany("");

      alert("Customer created!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setName(customer.name);
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setCompany(customer.company || "");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmed) return;

    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadCustomers();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-2 py-10 md:py-12 bg-gradient-to-br from-[#ece9f6] via-[#f4f2fb] to-[#e7d6fb] relative overflow-x-hidden">
      {/* Premium top glowing blob */}
      <div
        aria-hidden
        className="absolute -top-28 -left-40 w-[400px] h-[340px] bg-gradient-to-br from-pink-300 via-violet-300 to-indigo-300 opacity-40 blur-2xl rounded-full pointer-events-none z-0"
      />
      {/* Card Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div
          className={`border-0 shadow-2xl rounded-3xl p-0 md:p-0 bg-transparent mx-auto mb-6`}
        >
          <div
            className="w-full bg-white/95 dark:bg-white/90 rounded-3xl border border-violet-200 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              boxShadow:
                "0 6px 42px 0 rgba(110,120,237,0.16), 0 1.5px 8px 0 rgba(134,99,231,0.06)",
            }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-10 pt-8 md:pt-10 mb-6 md:mb-10 gap-4 bg-gradient-to-br from-[#e4d9fb]/80 to-[#f7f6fd]/90 border-b border-violet-100/50">
              <h1 className="flex items-center gap-4 text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-violet-800 to-fuchsia-600 drop-shadow-xl">
                <span className="rounded-full backdrop-blur-xl bg-gradient-to-br from-indigo-200 via-violet-200 to-fuchsia-100 p-4 shadow-xl border-2 border-fuchsia-200">
                  <HiOutlineUser
                    className="text-indigo-500 drop-shadow"
                    size={40}
                  />
                </span>
                <span>Customers</span>
              </h1>
              <Link
                href="/dashboard"
                className="inline-flex gap-2 text-md sm:text-base font-bold bg-gradient-to-r from-violet-200 via-indigo-100 to-pink-50 border border-violet-100 rounded-xl text-indigo-800 hover:bg-violet-100 hover:from-pink-100 hover:to-indigo-200 px-4 py-2 transition-all shadow-md"
              >
                <span>Back to Dashboard</span>
              </Link>
            </div>
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-7 bg-gradient-to-br from-white/95 via-indigo-50/40 to-violet-50/50 rounded-2xl px-8 md:px-16 py-8 border border-violet-100/50 mx-5 md:mx-16 -mt-20 shadow-xl transition-all"
              style={{ zIndex: 1, position: "relative" }}
            >
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="customer-name"
                    className="text-sm font-bold text-indigo-700 pl-1"
                  >
                    Name<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">
                      <HiOutlineUser size={20} />
                    </span>
                    <input
                      id="customer-name"
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-2 border-violet-200 bg-white/80 py-3 pl-11 pr-3 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 font-semibold transition-all shadow focus:shadow-lg"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="customer-email"
                    className="text-sm font-bold text-indigo-700 pl-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline"
                      >
                        <path
                          d="M4 7l8 5 8-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <input
                      id="customer-email"
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 border-violet-200 bg-white/80 py-3 pl-11 pr-3 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 font-semibold transition-all shadow focus:shadow-lg"
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="customer-phone"
                    className="text-sm font-bold text-indigo-700 pl-1"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">
                      <HiOutlinePhone size={20} />
                    </span>
                    <input
                      id="customer-phone"
                      type="text"
                      placeholder="Enter phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border-2 border-violet-200 bg-white/80 py-3 pl-11 pr-3 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 font-semibold transition-all shadow focus:shadow-lg"
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Company */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="customer-company"
                    className="text-sm font-bold text-indigo-700 pl-1"
                  >
                    Company
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">
                      <HiOutlineBuildingOffice2 size={20} />
                    </span>
                    <input
                      id="customer-company"
                      type="text"
                      placeholder="Enter company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full border-2 border-violet-200 bg-white/80 py-3 pl-11 pr-3 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 font-semibold transition-all shadow focus:shadow-lg"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex flex-col xs:flex-row flex-wrap items-center gap-4 justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-8 py-3 font-extrabold rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 text-white hover:from-violet-500 hover:to-indigo-700 shadow-xl focus:ring-4 focus:ring-violet-200 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ letterSpacing: 1.5 }}
                >
                  {editingId ? (
                    <>
                      <HiOutlinePencilSquare size={20} />
                      {loading ? "Updating..." : "Update"}
                    </>
                  ) : (
                    <>
                      <HiOutlinePlusCircle size={20} />
                      {loading ? "Creating..." : "Add Customer"}
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-8 py-3 font-bold rounded-xl bg-gradient-to-tr from-gray-100 via-violet-50 to-white text-indigo-600 hover:bg-gray-200 active:scale-95 border-2 border-violet-100 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow"
                    disabled={loading}
                  >
                    <HiOutlineXCircle size={20} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {/* Customer List Section */}
            <section className="px-5 md:px-12 pb-10">
              <div className="flex items-center justify-between mt-4 mb-6 flex-wrap gap-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-violet-800">
                  Customer List
                </h2>
                <span className="text-base text-violet-500 font-semibold bg-violet-50/90 px-4 py-1.5 rounded-2xl shadow select-none ring-1 ring-violet-100">
                  {customers.length} total
                </span>
              </div>
              {customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-5 text-center bg-gradient-to-tl from-slate-50/90 via-white/80 to-violet-50/80 px-10 py-20 rounded-3xl select-none font-medium border-2 border-violet-50 shadow-lg min-h-[180px]">
                  <HiOutlineUser
                    className="text-violet-200 drop-shadow-lg"
                    size={64}
                  />
                  <div className="text-lg md:text-xl text-violet-400">
                    No customers found.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="group bg-gradient-to-br from-white/95 via-violet-50/70 to-white/90 border-2 border-violet-100 shadow-xl hover:shadow-2xl transition hover:scale-[1.02] rounded-2xl px-7 py-8 flex flex-col justify-between gap-5 cursor-pointer hover:border-violet-200 relative"
                      style={{
                        minHeight: 200,
                        boxShadow:
                          "0 4px 32px 0 rgba(134,99,231,0.07),0 1.5px 8px 0 rgba(134,99,231,0.10)",
                      }}
                    >
                      <Link
                        href={`/customers/${customer.id}`}
                        className="flex items-center gap-4 font-bold text-xl text-indigo-900 group-hover:text-fuchsia-700 transition-all"
                        title="View Customer Details"
                      >
                        <span className="p-2.5 rounded-full bg-gradient-to-br from-indigo-100/80 via-violet-100/80 to-fuchsia-50 border border-indigo-50 group-hover:scale-105 transition-transform shadow">
                          <HiOutlineUser
                            size={32}
                            className="text-violet-400 drop-shadow"
                          />
                        </span>
                        <span className="truncate leading-tight">
                          {customer.name}
                        </span>
                      </Link>
                      <div className="grid grid-cols-1 gap-1 mt-2">
                        <div className="flex items-center gap-2 text-gray-500 truncate">
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline text-violet-200"
                          >
                            <path
                              d="M4 7l8 5 8-5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span
                            className={
                              customer.email
                                ? "truncate"
                                : "italic text-gray-300"
                            }
                          >
                            {customer.email || "No email"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 truncate">
                          <HiOutlinePhone
                            size={18}
                            className="text-violet-200"
                          />
                          <span
                            className={
                              customer.phone
                                ? "truncate"
                                : "italic text-gray-300"
                            }
                          >
                            {customer.phone || "No phone"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 truncate">
                          <HiOutlineBuildingOffice2
                            size={18}
                            className="text-violet-200"
                          />
                          <span
                            className={
                              customer.company
                                ? "truncate"
                                : "italic text-gray-300"
                            }
                          >
                            {customer.company || "No company"}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-6 right-6 flex gap-2 opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => handleEdit(customer)}
                          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-tr from-indigo-50/90 to-violet-100/90 text-violet-700 font-bold rounded-lg border border-violet-100 hover:bg-violet-200 hover:shadow focus-visible:ring-2 focus-visible:ring-violet-200 transition text-base shadow"
                        >
                          <HiOutlinePencilSquare size={18} />
                          <span className="sr-only sm:not-sr-only">Edit</span>
                        </button>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => handleDelete(customer.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-tr from-red-50/90 to-red-100/90 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-200 focus-visible:ring-2 focus-visible:ring-red-100 transition text-base shadow"
                        >
                          <HiOutlineTrash size={18} />
                          <span className="sr-only sm:not-sr-only">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      {/* Bottom glowing blob */}
      <div
        aria-hidden
        className="absolute bottom-[-100px] right-0 w-[400px] h-[260px] bg-gradient-to-br from-indigo-200 via-fuchsia-100 to-pink-200 opacity-40 blur-2xl rounded-full pointer-events-none z-0"
      />
      {/* Margin at bottom */}
      <div className="h-6" />
    </main>
  );
}
