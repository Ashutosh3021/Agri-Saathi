"use client"

import { motion } from "framer-motion"
import { Github, Mail, Shield } from "lucide-react"

const links = [
  { label: "GitHub", href: "#", icon: Github },
  { label: "Contact", href: "mailto:hello@agrisathi.com", icon: Mail },
  { label: "Privacy Policy", href: "#", icon: Shield },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground py-16 text-primary-foreground" id="footer">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-6"
      >
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-xl font-bold md:justify-start">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                AS
              </span>
              Agri Sathi
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/60">
              Technology in the hands of the farmer, not just the researcher.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                <link.icon size={16} />
                <span className="hidden sm:inline">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/40">
            &copy; 2026 Agri Sathi. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  )
}
