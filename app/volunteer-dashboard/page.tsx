import React from "react";
import Navbar from "@/components/navbar";

export default function VolunteerDashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">Volunteer Dashboard</h1>
          <p className="text-gray-600 text-center mb-8">
            Welcome to your volunteer dashboard! Here you will be able to track your activities, view upcoming events, and manage your profile.
          </p>
          {/* Add dashboard widgets/components here in the future */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <span className="block text-lg font-semibold mb-2">Your Hours</span>
              <span className="text-2xl font-bold text-blue-600">--</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <span className="block text-lg font-semibold mb-2">Upcoming Events</span>
              <span className="text-2xl font-bold text-green-600">--</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
