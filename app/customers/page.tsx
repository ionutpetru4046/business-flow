"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { HiOutlineUser, HiOutlinePhone, HiOutlineBuildingOffice2, HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlusCircle, HiOutlineXCircle } from "react-icons/hi2";

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex flex-col items-center px-2 py-8">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8">
        <h1 className="flex items-center gap-2 text-4xl font-extrabold tracking-tight text-indigo-700 mb-8">
          <HiOutlineUser className="text-indigo-400" size={36} />
          Customers
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-indigo-50 rounded-2xl p-6 border border-indigo-100 mb-10 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                <HiOutlineUser size={20} />
              </span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 pl-10 pr-3 rounded-xl focus:outline-none focus:border-indigo-400 transition"
                required
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
              </span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 pl-10 pr-3 rounded-xl focus:outline-none focus:border-indigo-400 transition"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                <HiOutlinePhone size={20} />
              </span>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 pl-10 pr-3 rounded-xl focus:outline-none focus:border-indigo-400 transition"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                <HiOutlineBuildingOffice2 size={20} />
              </span>
              <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border border-indigo-200 bg-white py-3 pl-10 pr-3 rounded-xl focus:outline-none focus:border-indigo-400 transition"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 cursor-pointer font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {editingId ? (
                <>
                  <HiOutlinePencilSquare size={18} />
                  {loading ? "Updating..." : "Update Customer"}
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
                className="flex items-center gap-2 px-5 py-2 font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 border border-gray-200 transition"
                disabled={loading}
              >
                <HiOutlineXCircle size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
        <section>
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Customer List</h2>
          {customers.length === 0 ? (
            <div className="text-gray-500 text-center bg-slate-50 px-8 py-12 rounded-xl select-none font-medium">
              No customers found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white border border-indigo-100 shadow hover:shadow-lg rounded-2xl p-6 transition group"
                >
                  <Link
                    href={`/customers/${customer.id}`}
                    className="flex items-center gap-2 font-bold text-xl text-indigo-700 group-hover:underline"
                  >
                    <HiOutlineUser size={24} className="text-indigo-300" />
                    {customer.name}
                  </Link>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>{customer.email || <span className="italic text-gray-300">No email</span>}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <HiOutlinePhone size={18} className="text-indigo-200" />
                      <span>{customer.phone || <span className="italic text-gray-300">No phone</span>}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <HiOutlineBuildingOffice2 size={18} className="text-indigo-200" />
                      <span>{customer.company || <span className="italic text-gray-300">No company</span>}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6 justify-end">
                    <button
                      type="button"
                      onClick={() => handleEdit(customer)}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-200 transition text-sm"
                    >
                      <HiOutlinePencilSquare size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(customer.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition text-sm"
                    >
                      <HiOutlineTrash size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
