"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  HiOutlineUser,
  HiOutlineTruck,
  HiOutlineDocumentText,
} from "react-icons/hi2";

import CustomerInfo from "@/components/customer/CustomerInfo";
import NotesSection from "@/components/customer/NotesSection";
import TasksSection from "@/components/customer/TasksSection";
import AppointmentSection from "@/components/customer/AppointmentsSection";
import VehiclesSection from "@/components/customer/VehiclesSection";
import ServiceHistorySection from "@/components/customer/ServiceHistorySection";
import JobCardsSection from "@/components/customer/JobCardsSection";
import { Customer } from "@/types/customer";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  vin: string | null;
  created_at: string;
};

type ServiceRecord = {
  id: string;
  vehicle_id: string;
  service_name: string;
  service_date: string;
  cost: number | null;
  notes: string | null;
};

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);

  // Service history fetching by customer vehicles
  const loadServiceHistory = useCallback(
    async (vehicleIds: string[]) => {
      if (vehicleIds.length === 0) {
        setServices([]);
        return;
      }

      const { data, error } = await supabase
        .from("service_history")
        .select("*")
        .in("vehicle_id", vehicleIds)
        .order("service_date", {
          ascending: false,
        });

      if (error) {
        console.error(
          "[loadServiceHistory] Error:",
          error
        );

        setServices([]);
        return;
      }

      setServices(data ?? []);
    },
    []
  );

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

  // Load vehicles, and also trigger service history loading for those vehicles
  const loadVehicles = useCallback(async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setVehicles([]);
      setServices([]);
      return;
    }

    setVehicles(data ?? []);
    
    // Fetch service history for these vehicles
    if (data && data.length > 0) {
      const vIds = data.map((v: Vehicle) => v.id);
      await loadServiceHistory(vIds);
    } else {
      setServices([]);
    }
  }, [id, loadServiceHistory]);

  useEffect(() => {
    if (id) {
      loadCustomer();
      loadVehicles();
    }
  }, [id, loadCustomer, loadVehicles]);

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

  // Service history grouping by vehicle (for display)
  const servicesByVehicle: { [vehicleId: string]: ServiceRecord[] } = {};
  vehicles.forEach((v) => {
    servicesByVehicle[v.id] = [];
  });
  services.forEach((service) => {
    if (servicesByVehicle[service.vehicle_id]) {
      servicesByVehicle[service.vehicle_id].push(service);
    }
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12">
      <div className="bg-white shadow-2xl rounded-3xl px-10 py-10 max-w-2xl w-full">

        <CustomerInfo customer={customer} />

        <NotesSection customerId={id} />

        {/* Tasks Section */}
        <TasksSection customerId={id} />

        {/* Appointments Section */}
        <AppointmentSection customerId={id} />

        {/* Vehicles Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <HiOutlineTruck className="text-xl" />
            Vehicles
          </h2>

          <div className="space-y-3">
            {vehicles.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-6">
                No vehicles registered yet.
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white border rounded-xl p-4 shadow flex items-start justify-between border-indigo-100"
                >
                  <div>
                    <p className="font-semibold text-indigo-900">
                      {vehicle.make} {vehicle.model}
                      {vehicle.year ? ` (${vehicle.year})` : ""}
                    </p>
                    <div className="mt-1 space-y-0.5 text-sm text-gray-500">
                      {vehicle.license_plate && (
                        <p>Plate: {vehicle.license_plate}</p>
                      )}
                      {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Service History Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <HiOutlineDocumentText className="text-xl" />
            Service History
          </h2>

          {vehicles.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-6">
              No vehicles registered yet.
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-indigo-800">
                    {vehicle.make} {vehicle.model}
                  </span>
                  {vehicle.year && (
                    <span className="text-xs text-gray-500">({vehicle.year})</span>
                  )}
                  {vehicle.license_plate && (
                    <span className="text-xs text-gray-500">
                      Plate: {vehicle.license_plate}
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto bg-indigo-50 rounded-xl">
                  <table className="min-w-full divide-y divide-indigo-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Service</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Cost</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicesByVehicle[vehicle.id] && servicesByVehicle[vehicle.id].length > 0 ? (
                        servicesByVehicle[vehicle.id].map((service) => (
                          <tr key={service.id} className="bg-white border-b border-indigo-100">
                            <td className="px-4 py-2">{service.service_name}</td>
                            <td className="px-4 py-2">{new Date(service.service_date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                              {service.cost != null ? (
                                <span>
                                  {service.cost.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="px-4 py-2">{service.notes || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                            No service history for this vehicle yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}