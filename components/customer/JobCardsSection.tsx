
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  HiOutlineClipboardDocumentList,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import { JobCard } from "@/types/customer";

type Props = {
  customerId: string;
};

export default function JobCardsSection({ customerId }: Props) {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadJobCards() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("job_cards")
      .select("*")
      .eq("customer_id", customerId)
      .order("date", { ascending: false });

    if (error) {
      setError("Failed to load job cards.");
      setJobCards([]);
    } else {
      setJobCards(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (customerId) {
      loadJobCards();
    } else {
      setJobCards([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  function resetForm() {
    setEditingId(null);
    setVehicle("");
    setDate("");
    setSummary("");
    setStatus("");
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const jobCardObj = {
      vehicle,
      date,
      summary,
      status,
      customer_id: customerId,
    };

    let saveError = null;
    if (editingId) {
      const { error } = await supabase
        .from("job_cards")
        .update(jobCardObj)
        .eq("id", editingId);
      if (error) saveError = error;
    } else {
      const { error } = await supabase.from("job_cards").insert([jobCardObj]);
      if (error) saveError = error;
    }
    setSaving(false);

    if (saveError) {
      setError("Failed to save job card.");
      return;
    }
    resetForm();
    await loadJobCards();
  }

  async function handleDelete(id: string) {
    setError(null);
    const { error } = await supabase.from("job_cards").delete().eq("id", id);
    if (error) {
      setError("Failed to delete job card.");
      return;
    }
    if (editingId === id) resetForm();
    await loadJobCards();
  }

  function handleEdit(entry: JobCard) {
    setEditingId(entry.id);
    setVehicle(entry.vehicle || "");
    setDate(entry.date || "");
    setSummary(entry.summary || "");
    setStatus(entry.status || "");
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
        <HiOutlineClipboardDocumentList className="text-xl" />
        Job Cards
      </h2>
      <div className="bg-indigo-50 rounded-xl p-5 mb-6">
        {error && (
          <div className="mb-2 text-red-600 text-sm font-medium">{error}</div>
        )}
        <div className="grid gap-3 mb-3">
          <input
            type="text"
            placeholder="Vehicle"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="text"
            placeholder="Job summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            type="button"
            disabled={
              saving ||
              !vehicle.trim() ||
              !date ||
              !summary.trim() ||
              !status.trim()
            }
          >
            <HiOutlinePlusCircle />
            {editingId ? "Save Changes" : "Add Job Card"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-semibold"
              type="button"
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <div className="py-8 text-center text-indigo-400 font-medium">
            Loading job cards...
          </div>
        ) : jobCards.length === 0 ? (
          <div className="py-8 text-center text-indigo-400 font-medium">
            No job cards yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-5" data-testid="job-cards-list">
            {jobCards.map((entry) => (
              <li
                key={entry.id}
                className="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-lg text-indigo-900 mb-1">
                    {entry.vehicle}
                  </div>
                  <div className="text-sm text-gray-500 mb-0.5">
                    {entry.date}
                  </div>
                  <div className="text-sm text-indigo-700 mb-0.5">
                    {entry.summary}
                  </div>
                  <div className="text-xs text-gray-400">
                    Status:{" "}
                    <span className="font-semibold text-gray-500">
                      {entry.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full focus:outline-none"
                    aria-label="Edit job card"
                    type="button"
                  >
                    <HiOutlinePencilSquare className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none"
                    aria-label="Delete job card"
                    type="button"
                  >
                    <HiOutlineTrash className="text-xl" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}