'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  HiOutlineWrenchScrewdriver,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import { ServiceRecord } from "@/types/customer";

type Props = {
  customerId: string;
};

export default function ServiceHistorySection({ customerId }: Props) {
  // FIX: Use ServiceRecord instead of ServiceHistory
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Properly fetch service history with feedback
  async function loadHistory() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("service_history")
      .select("*")
      .eq("customer_id", customerId)
      .order("date", { ascending: false });

    if (error) {
      setError("Failed to load service history.");
      setServiceHistory([]);
    } else {
      setServiceHistory(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (customerId) {
      // The following is safe; some linters warn, but this is standard for async data load in effects
      loadHistory();
    } else {
      setServiceHistory([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  function resetForm() {
    setEditingId(null);
    setVehicle("");
    setDate("");
    setDescription("");
    setCost("");
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const historyObj = {
      vehicle,
      date,
      description,
      cost: cost === "" ? null : parseFloat(cost),
      customer_id: customerId,
    };

    let saveError = null;
    if (editingId) {
      const { error } = await supabase
        .from("service_history")
        .update(historyObj)
        .eq("id", editingId);
      if (error) saveError = error;
    } else {
      const { error } = await supabase
        .from("service_history")
        .insert([historyObj]);
      if (error) saveError = error;
    }
    setSaving(false);

    if (saveError) {
      setError("Failed to save service record.");
      return;
    }
    resetForm();
    await loadHistory();
  }

  async function handleDelete(id: string) {
    setError(null);
    const { error } = await supabase
      .from("service_history")
      .delete()
      .eq("id", id);
    if (error) {
      setError("Failed to delete service record.");
      return;
    }
    setServiceHistory((prev) => prev.filter((h) => h.id !== id));
    if (editingId === id) resetForm();
  }

  // FIX: Use ServiceRecord as the type for entry
  function handleEdit(entry: ServiceRecord) {
    setEditingId(entry.id);
    setVehicle(entry.vehicle || "");
    setDate(entry.date || "");
    setDescription(entry.description || "");
    setCost(
      typeof entry.cost === "number" && !isNaN(entry.cost)
        ? entry.cost.toString()
        : ""
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <HiOutlineWrenchScrewdriver className="text-xl" />
        Service History
      </h2>

      {/* Add/Edit Service History */}
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
            placeholder="Service description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
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
              !description.trim() ||
              (cost !== "" && isNaN(Number(cost)))
            }
          >
            <HiOutlinePlusCircle />
            {editingId ? "Save Changes" : "Add Service"}
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
            Loading service history...
          </div>
        ) : serviceHistory.length === 0 ? (
          <div className="py-8 text-center text-indigo-400 font-medium">
            No service history yet.
          </div>
        ) : (
          <ul
            className="flex flex-col gap-5"
            data-testid="service-history-list"
          >
            {serviceHistory.map((entry) => (
              <li
                key={entry.id}
                className="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-lg text-indigo-900 mb-1">
                    {entry.vehicle}
                  </div>
                  <div className="text-sm text-gray-500 mb-0.5">
                    {entry.date
                      ? new Date(entry.date).toLocaleDateString()
                      : "No date"}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    {entry.description}
                  </div>
                  <div className="text-xs text-gray-700 mb-0.5">
                    Cost:{" "}
                    <span className="font-semibold">
                      {typeof entry.cost === "number" &&
                      !isNaN(entry.cost)
                        ? `$${entry.cost.toFixed(2)}`
                        : "-"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full focus:outline-none"
                    aria-label="Edit service record"
                    type="button"
                  >
                    <HiOutlinePencilSquare className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none"
                    aria-label="Delete service record"
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