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
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      setCustomers(data ?? []);
    };

    load();
  }, []);

  const loadCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setCustomers(data ?? []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
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
          setLoading(false);
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
        },
      ]);

      if (error) {
        alert(error.message);
        setLoading(false);
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
    <main className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-fuchsia-50 flex flex-col items-center px-2 py-8">
      {/* Card Container */}
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 md:p-10 border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight text-indigo-800 drop-shadow-sm">
            <span className="rounded-full bg-gradient-to-tr from-indigo-200 to-violet-300 p-3">
              <HiOutlineUser className="text-indigo-500" size={36} />
            </span>
            <span>Customers</span>
          </h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <div className="relative group">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none opacity-0 group-hover:opacity-70 transition">
                <HiOutlinePlusCircle size={23} />
              </span>
              <span className="text-sm text-indigo-400 pl-8 sm:hidden block select-none">Add below</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white/90 rounded-2xl p-4 md:p-8 border border-indigo-100 mb-10 shadow-sm transition-all"
        >
          <div className="grid gap-4 gap-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="customer-name" className="text-sm font-medium text-indigo-600 pl-1">Name<span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                  <HiOutlineUser size={20} />
                </span>
                <input
                  id="customer-name"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-indigo-200 bg-white/70 py-3 pl-10 pr-3 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="customer-email" className="text-sm font-medium text-indigo-600 pl-1">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline"><path d="M4 4h16v16H4z" fill="none"/><path d="M4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <input
                  id="customer-email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-indigo-200 bg-white/70 py-3 pl-10 pr-3 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
                  autoComplete="off"
                />
              </div>
            </div>
            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="customer-phone" className="text-sm font-medium text-indigo-600 pl-1">Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                  <HiOutlinePhone size={20} />
                </span>
                <input
                  id="customer-phone"
                  type="text"
                  placeholder="Enter phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-indigo-200 bg-white/70 py-3 pl-10 pr-3 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
                  autoComplete="off"
                />
              </div>
            </div>
            {/* Company */}
            <div className="flex flex-col gap-1">
              <label htmlFor="customer-company" className="text-sm font-medium text-indigo-600 pl-1">Company</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                  <HiOutlineBuildingOffice2 size={20} />
                </span>
                <input
                  id="customer-company"
                  type="text"
                  placeholder="Enter company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-indigo-200 bg-white/70 py-3 pl-10 pr-3 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col xs:flex-row flex-wrap items-center gap-3 justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 font-semibold rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-700 active:scale-95 shadow-lg focus:ring-2 focus:ring-indigo-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {editingId ? (
                <>
                  <HiOutlinePencilSquare size={18} />
                  {loading ? "Updating..." : "Update"}
                </>
              ) : (
                <>
                  <HiOutlinePlusCircle size={18} />
                  {loading ? "Creating..." : "Add Customer"}
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-5 py-2 font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 border border-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <HiOutlineXCircle size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Customer List Section */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">Customer List</h2>
            <span className="text-sm text-indigo-400 font-semibold bg-indigo-50 px-3 py-1 rounded-full shadow-sm select-none">
              {customers.length} total
            </span>
          </div>
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center bg-gradient-to-r from-slate-50 to-violet-50 px-8 py-16 md:py-18 rounded-2xl select-none font-medium border border-indigo-50">
              <HiOutlineUser className="text-indigo-200" size={52} />
              <div className="text-lg text-indigo-400">No customers found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white/90 border border-indigo-100 shadow hover:shadow-xl rounded-2xl px-6 py-7 flex flex-col justify-between gap-3 transition-transform group hover:-translate-y-1"
                  style={{ minHeight: 180 }}
                >
                  <Link
                    href={`/customers/${customer.id}`}
                    className="flex items-center gap-3 font-semibold text-lg text-indigo-800 group-hover:underline"
                  >
                    <span className="p-2 rounded-full bg-gradient-to-br from-indigo-100 to-white border border-indigo-50">
                      <HiOutlineUser size={30} className="text-indigo-400" />
                    </span>
                    <span>{customer.name}</span>
                  </Link>
                  <div className="grid grid-cols-1 gap-0.5 sm:gap-1 mt-2">
                    <div className="flex items-center gap-2 text-gray-600 truncate">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline text-indigo-200"><path d="M4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span className={customer.email ? "truncate" : "italic text-gray-300"}>
                        {customer.email || "No email"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 truncate">
                      <HiOutlinePhone size={18} className="text-indigo-200" />
                      <span className={customer.phone ? "truncate" : "italic text-gray-300"}>
                        {customer.phone || "No phone"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 truncate">
                      <HiOutlineBuildingOffice2 size={18} className="text-indigo-200" />
                      <span className={customer.company ? "truncate" : "italic text-gray-300"}>
                        {customer.company || "No company"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-5 justify-end">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => handleEdit(customer)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-tr from-indigo-50 to-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-100 hover:bg-indigo-200 focus-visible:ring-2 focus-visible:ring-indigo-200 transition text-sm"
                    >
                      <HiOutlinePencilSquare size={16} />
                      <span className="sr-only sm:not-sr-only">Edit</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => handleDelete(customer.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-tr from-red-50 to-red-100 text-red-600 font-semibold rounded-lg border border-red-100 hover:bg-red-200 focus-visible:ring-2 focus-visible:ring-red-100 transition text-sm"
                    >
                      <HiOutlineTrash size={16} />
                      <span className="sr-only sm:not-sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {/* Slight bottom space on mobile */}
      <div className="h-8" />
    </main>
  );
}
