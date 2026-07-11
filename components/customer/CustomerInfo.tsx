import {
    HiOutlineUser,
    HiOutlinePhone,
    HiOutlineBuildingOffice2,
  } from "react-icons/hi2";
  
  import { Customer } from "@/types/customer";
  
  type Props = {
    customer: Customer;
  };
  
  export default function CustomerInfo({
    customer,
  }: Props) {
    return (
      <>
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
              <p className="text-xs text-gray-500">
                Email
              </p>
  
              <p className="font-semibold text-indigo-900 break-all">
                {customer.email || "-"}
              </p>
            </div>
          </div>
  
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
            <HiOutlinePhone className="text-xl text-indigo-500" />
  
            <div>
              <p className="text-xs text-gray-500">
                Phone
              </p>
  
              <p className="font-semibold text-indigo-900">
                {customer.phone || "-"}
              </p>
            </div>
          </div>
  
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4 col-span-1 md:col-span-2">
            <HiOutlineBuildingOffice2 className="text-xl text-indigo-500" />
  
            <div>
              <p className="text-xs text-gray-500">
                Company
              </p>
  
              <p className="font-semibold text-indigo-900">
                {customer.company || "-"}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }