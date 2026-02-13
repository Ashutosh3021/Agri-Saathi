import { redirect } from "next/navigation"

export default function VolunteerLoginRoot() {
  // Redirect /Volunteers/volunteers to /Volunteers (the main volunteers page)
  redirect("/Volunteers")
}
