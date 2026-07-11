'use client';

import { useState, useEffect } from "react";
import {
  HiOutlineTruck,
  HiOutlinePlusCircle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import { supabase } from "@/lib/supabase";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  vin: string | null;
  created_at: string;
};

interface VehiclesSectionProps {
  customerId: string;
}

export default function VehiclesSection({ customerId }: VehiclesSectionProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Fetch vehicles for this customer
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading vehicles:", error);
        setVehicles([]);
      } else {
        setVehicles(data ?? []);
      }
      setLoading(false);
    };

    if (customerId) {
      fetchVehicles();
    }
  }, [customerId]);

  const resetForm = () => {
    setMake("");
    setModel("");
    setYear("");
    setLicensePlate("");
    setVin("");
    setEditingVehicleId(null);
  };

  const handleSaveVehicle = async () => {
    setLoading(true);
    if (editingVehicleId) {
      // update
      const { error } = await supabase
        .from("vehicles")
        .update({
          make,
          model,
          year: typeof year === "string" ? null : year,
          license_plate: licensePlate || null,
          vin: vin || null,
        })
        .eq("id", editingVehicleId);

      if (error) {
        alert("Failed to update vehicle.");
      }
    } else {
      // create
      const { error } = await supabase.from("vehicles").insert([
        {
          customer_id: customerId,
          make,
          model,
          year: typeof year === "string" ? null : year,
          license_plate: licensePlate || null,
          vin: vin || null,
        },
      ]);
      if (error) {
        alert("Failed to add vehicle.");
      }
    }
    // refetch
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    setVehicles(data ?? []);
    resetForm();
    setLoading(false);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicleId(vehicle.id);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setYear(vehicle.year ?? "");
    setLicensePlate(vehicle.license_plate ?? "");
    setVin(vehicle.vin ?? "");
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    setLoading(true);
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      alert("Failed to delete vehicle.");
    }
    // refetch
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    setVehicles(data ?? []);
    setLoading(false);
    if (editingVehicleId === id) resetForm();
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <HiOutlineTruck className="text-xl" />
        Vehicles
      </h2>

      {/* Vehicle form */}
      <div className="bg-indigo-50 rounded-xl p-5 mb-6">
        <div className="grid gap-3 mb-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="text"
            placeholder="License Plate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
          <input
            type="text"
            placeholder="VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            className="w-full border border-indigo-200 bg-white py-3 px-4 rounded-lg focus:border-indigo-400 transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveVehicle}
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            type="button"
            disabled={
              loading ||
              !make.trim() ||
              !model.trim() ||
              (year !== "" && (typeof year !== "number" || isNaN(year)))
            }
          >
            <HiOutlinePlusCircle />
            {editingVehicleId ? "Save Changes" : "Add Vehicle"}
          </button>
          {editingVehicleId && (
            <button
              onClick={resetForm}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-semibold"
              type="button"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Vehicle list */}
      <div>
        {loading ? (
          <div className="py-8 text-center text-indigo-400 font-medium">
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="py-8 text-center text-indigo-400 font-medium">
            No vehicles yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {vehicles.map((vehicle) => (
              <li
                key={vehicle.id}
                className="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-lg text-indigo-900 mb-1">
                    {vehicle.make} {vehicle.model}
                  </div>
                  <div className="text-sm text-gray-500 mb-0.5">
                    {vehicle.year || "Year unknown"}
                  </div>
                  <div className="text-xs text-gray-400 mb-0.5">
                    Plate:{" "}
                    <span className="font-semibold text-gray-500">
                      {vehicle.license_plate || "-"}
                    </span>{" "}
                    | VIN:{" "}
                    <span className="font-semibold text-gray-500">{vehicle.vin || "-"}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEditVehicle(vehicle)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full focus:outline-none"
                    aria-label="Edit vehicle"
                    type="button"
                  >
                    <HiOutlinePencilSquare className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none"
                    aria-label="Delete vehicle"
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