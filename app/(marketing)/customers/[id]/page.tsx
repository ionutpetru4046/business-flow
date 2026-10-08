"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  HiOutlineUser,
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

export default function CustomerDetailsPage() {  
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  
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


  useEffect(() => {
    if (id) {
      loadCustomer();

    }
  }, [id, loadCustomer]);

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

        <CustomerInfo customer={customer} />

        <NotesSection customerId={id} />

        {/* Tasks Section */}
        <TasksSection customerId={id} />

        {/* Appointments Section */}
        <AppointmentSection customerId={id} />

        {/* Vehicles Section */}
        <VehiclesSection customerId={id} />

        {/* Service History Section */}
        <ServiceHistorySection customerId={id} />

        <JobCardsSection customerId={id} />
      </div>
    </main>
  );
}