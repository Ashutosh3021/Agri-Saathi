import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          Agri Volunteer
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          Earn while you help farmers. Join a growing network of volunteers
          making agriculture accessible for everyone.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="rounded-xl font-semibold">
          <Link href="/Volunteers">
            Volunteer Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-xl font-semibold"
        >
          <Link href="/#volunteer-signup">Apply as Volunteer</Link>
        </Button>
      </div>
    </main>
  )
}
