"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Note } from "@/types/customer";

import { HiOutlineDocumentText, HiOutlinePaperAirplane } from "react-icons/hi2";

export default function NotesSection({ customerId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setNotes(data ?? []);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleAddNote = async () => {
    if (!note.trim()) return;

    const { error } = await supabase.from("notes").insert([
      {
        customer_id: customerId,
        content: note,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNote("");

    await loadNotes();
  };

  return (
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
            placeholder="Write a note..."
            className="w-full border border-indigo-200 py-3 px-4 rounded-lg"
            rows={3}
          />

          <button
            onClick={handleAddNote}
            className="bg-indigo-600 text-white px-4 py-3 rounded-lg"
          >
            <HiOutlinePaperAirplane />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center text-gray-400">No notes yet</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white border rounded-xl p-4">
              <p>{note.content}</p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
