"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HiOutlineUser, HiOutlinePhone, HiOutlineBuildingOffice2, HiOutlineDocumentText, HiOutlinePaperAirplane } from "react-icons/hi2";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
};

type Note = {
  id: string;
  content: string;
  created_at: string;
};

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");

  // Incarca detaliile clientului
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

  // Incarca notitele clientului
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

  // Adauga o notita noua
  const handleAddNote = useCallback(async () => {
    if (!note.trim()) return;

    const { error } = await supabase
      .from("notes")
      .insert([
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

  useEffect(() => {
    if (id) {
      loadCustomer();
      loadNotes();
    }
  }, [id, loadCustomer, loadNotes]);

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12">
      <div className="bg-white shadow-2xl rounded-3xl px-10 py-10 max-w-2xl w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-100 rounded-full p-5 mb-3">
            <HiOutlineUser className="text-4xl text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-1 text-center">
            {customer.name}
          </h1>
          <p className="text-base text-gray-500 text-center">
            Customer Details
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-indigo-900 break-all">{customer.email || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
            <HiOutlinePhone className="text-xl text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-semibold text-indigo-900">{customer.phone || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4 col-span-1 md:col-span-2">
            <HiOutlineBuildingOffice2 className="text-xl text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500">Company</p>
              <p className="font-semibold text-indigo-900">{customer.company || "-"}</p>
            </div>
          </div>
        </section>

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
            <p className="text-xs text-gray-400 pl-1">Keep track of important conversations and reminders here.</p>
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
      </div>
    </main>
  );
}