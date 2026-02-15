"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type FormState = "initial" | "loading" | "success" | "error"

export function VolunteerLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formState, setFormState] = useState<FormState>("initial")
  const [errorMessage, setErrorMessage] = useState("")

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.")
      setFormState("error")
      return
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.")
      setFormState("error")
      return
    }

    setFormState("loading")

    try {
      const response = await fetch('/api/auth/volunteer-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormState("success")
        // Redirect to volunteer dashboard
        setTimeout(() => {
          router.push('/volunteer/dashboard')
        }, 1500)
      } else {
        setErrorMessage(data.error || "Invalid email or password. Please try again.")
        setFormState("error")
      }
    } catch (error) {
      setErrorMessage("Failed to login. Please try again.")
      setFormState("error")
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* Logo - only visible on mobile/tablet */}
      <div className="mb-8 text-center lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-2xl font-bold text-primary" aria-label="Agri Volunteer">
            Agri Volunteer
          </span>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          Earn while you help farmers
        </p>
      </div>

      <Card className="w-full border-0 shadow-none sm:border sm:shadow-sm sm:p-2">
        {formState === "success" ? (
          /* ── Success state ── */
          <>
            <CardHeader className="items-center space-y-2 text-center sm:pb-6">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 sm:h-14 sm:w-14">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 sm:h-7 sm:w-7" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Login Successful!</CardTitle>
              <CardDescription className="text-sm leading-relaxed sm:text-base">
                Welcome back! Redirecting you to your dashboard...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-center sm:pt-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </CardContent>
          </>
        ) : (
          /* ── Initial / Loading / Error states ── */
          <>
            <CardHeader className="space-y-1 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl">Login to Your Dashboard</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="sm:pt-2">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="volunteer-email">Email Address</Label>
                  <Input
                    id="volunteer-email"
                    type="email"
                    placeholder="volunteer@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (formState === "error") {
                        setFormState("initial")
                        setErrorMessage("")
                      }
                    }}
                    disabled={formState === "loading"}
                    className="h-11 rounded-xl"
                    required
                    aria-describedby={
                      formState === "error" ? "login-error" : undefined
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="volunteer-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="volunteer-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (formState === "error") {
                          setFormState("initial")
                          setErrorMessage("")
                        }
                      }}
                      disabled={formState === "loading"}
                      className="h-11 rounded-xl pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {formState === "error" && (
                  <div id="login-error" role="alert" className="text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={formState === "loading" || !email || !password}
                  className="h-11 w-full rounded-xl font-semibold"
                >
                  {formState === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  <Link
                    href="/#volunteer-signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </p>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/#volunteer-signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Apply to become a volunteer
                  </Link>
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
