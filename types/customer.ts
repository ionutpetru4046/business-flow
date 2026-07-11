export type Customer = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
  };
  
  export type Note = {
    id: string;
    content: string;
    created_at: string;
  };
  
  export type Vehicle = {
    id: string;
    make: string;
    model: string;
    year: number | null;
    license_plate: string | null;
    vin: string | null;
    created_at: string;
  };
  
  export type Appointment = {
    id: string;
    title: string;
    appointment_date: string;
    status: string;
  };
  
  export type Task = {
    id: string;
    title: string;
    completed: boolean;
  };
  
  export type ServiceRecord = {
    id: string;
    vehicle_id: string;
    service_name: string;
    service_date: string;
    cost: number | null;
    notes: string | null;
  };