import { VolunteerLoginForm } from "./components/volunteers/volunteer-login-form"
import { GradientPanel } from "./components/volunteers/gradient-panel"

export default function VolunteersLoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Login Form */}
      <div className="flex flex-col">
        {/* Header with logo */}
        <div className="flex items-center gap-2 p-6 md:p-10">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <span className="text-lg font-semibold">AgriSathi</span>
          </a>
        </div>

        {/* Form container - takes full width on desktop */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 md:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <VolunteerLoginForm />
          </div>
        </div>
      </div>

      {/* Right side - Gradient Panel (hidden on mobile) */}
      <GradientPanel />
    </div>
  )
}
