"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "For Farmers", href: "#solution" },
  { label: "For Volunteers", href: "#volunteer-signup" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#footer" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isVolunteer, setIsVolunteer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
        
        if (session?.user) {
          const role = session.user.user_metadata?.role
          setIsVolunteer(role === 'volunteer')
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      const role = session?.user?.user_metadata?.role
      setIsVolunteer(role === 'volunteer')
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm">
            AS
          </span>
          Agri Sathi
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          
          {!loading && (
            <>
              {!user ? (
                <button
                  onClick={() => document.getElementById('volunteer-signup')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl px-5 py-2 font-semibold text-sm transition-colors"
                >
                  Join as Volunteer
                </button>
              ) : isVolunteer ? (
                <Link
                  href="/Volunteers/Dashboard"
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-5 py-2 font-semibold text-sm transition-colors"
                >
                  Dashboard →
                </Link>
              ) : null}
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              
              {!loading && (
                <>
                  {!user ? (
                    <button
                      onClick={() => {
                        document.getElementById('volunteer-signup')?.scrollIntoView({ behavior: 'smooth' })
                        setMobileOpen(false)
                      }}
                      className="mt-2 w-full rounded-lg border-2 border-green-600 bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      Join as Volunteer
                    </button>
                  ) : isVolunteer ? (
                    <Link
                      href="/Volunteers/Dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="mt-2 w-full rounded-lg bg-amber-600 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                    >
                      Dashboard →
                    </Link>
                  ) : null}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
