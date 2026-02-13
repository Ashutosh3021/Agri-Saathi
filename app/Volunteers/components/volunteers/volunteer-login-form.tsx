"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react"

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
  const [email, setEmail] = useState("")
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

    setFormState("loading")

    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormState("success")
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.")
        setFormState("error")
      }
    } catch (error) {
      setErrorMessage("Failed to send login link. Please try again.")
      setFormState("error")
    }
  }

  const handleResend = async () => {
    setFormState("loading")
    
    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormState("success")
      } else {
        setErrorMessage(data.error || "Failed to resend. Please try again.")
        setFormState("error")
      }
    } catch (error) {
      setErrorMessage("Failed to resend. Please try again.")
      setFormState("error")
    }
  }

  const handleBackToLogin = () => {
    setEmail("")
    setFormState("initial")
    setErrorMessage("")
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
              <CardTitle className="text-xl sm:text-2xl">Check Your Email</CardTitle>
              <CardDescription className="text-sm leading-relaxed sm:text-base">
                {"We've sent a login link to "}
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-center sm:pt-2">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to access your dashboard. Link
                expires in 1 hour.
              </p>
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-medium text-primary"
                onClick={handleResend}
              >
                {"Didn't receive it? Resend"}
              </Button>
              <Button
                variant="ghost"
                className="h-auto p-0 text-sm text-muted-foreground"
                onClick={handleBackToLogin}
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back to login
              </Button>
            </CardContent>
          </>
        ) : (
          /* ── Initial / Loading / Error states ── */
          <>
            <CardHeader className="space-y-1 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl">Login to Your Dashboard</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter your registered email to receive a login link
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
                      formState === "error" ? "email-error" : undefined
                    }
                  />
                  {formState === "error" && (
                    <div id="email-error" role="alert">
                      <p className="text-sm text-destructive">{errorMessage}</p>
                      {errorMessage.includes("not registered") && (
                        <Link
                          href="/#volunteer-signup"
                          className="mt-1 inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Apply as a volunteer
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={formState === "loading" || !email}
                  className="h-11 w-full rounded-xl font-semibold"
                >
                  {formState === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Login Link
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link
                  href="/#volunteer-signup"
                  className="font-medium text-primary hover:underline"
                >
                  Apply to become a volunteer
                </Link>
              </p>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
