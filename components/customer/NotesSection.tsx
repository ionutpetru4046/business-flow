"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Note } from "@/types/customer";

import { HiOutlineDocumentText, HiOutlinePaperAirplane } from "react-icons/hi2";

// Define the prop type inline, since Props is not declared elsewhere
type NotesSectionProps = { customerId: string };

export default function NotesSection({ customerId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setErrorMsg(null);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setErrorMsg(error.message ?? "Failed to load notes.");
      return;
    }

    setNotes(data ?? []);
  });

  // Use useEffect correctly: no cascading renders as loadNotes does setState but is already async
  useEffect(() => {
    // Immediately Invoked Function Expression for async in useEffect
    (async () => {
      await loadNotes();
    })();
    // Should reload notes if customerId changes
  }, [customerId, loadNotes]);

  const handleAddNote = async () => {
    setErrorMsg(null);
    if (!note.trim()) return;

    const { error } = await supabase.from("notes").insert([
      {
        customer_id: customerId,
        content: note,
      },
    ]);

    if (error) {
      setErrorMsg(error.message ?? "Failed to add note.");
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
            aria-label="Add Note"
          >
            <HiOutlinePaperAirplane />
          </button>
        </div>
        {errorMsg && (
          <div className="text-sm text-red-600 mt-2">{errorMsg}</div>
        )}
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
