'use client'

import { VolunteerLoginForm } from "./components/volunteers/volunteer-login-form"

export default function VolunteersPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <VolunteerLoginForm />
      </div>
    </div>
  )
}
