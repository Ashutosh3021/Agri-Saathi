import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Solution } from "@/components/landing/solution"
import { HowItWorks } from "@/components/landing/how-it-works"
import { StatsBar } from "@/components/landing/stats-bar"
import { Revenue } from "@/components/landing/revenue"
import { Demo } from "@/components/landing/demo"
import { Footer } from "@/components/landing/footer"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <StatsBar />
      <Revenue />
      <Demo />
      <Footer />
    </main>
  )
}
