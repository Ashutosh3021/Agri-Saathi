import { Users, IndianRupee, Star } from "lucide-react"

const stats = [
  {
    icon: IndianRupee,
    text: "50,000+ earned by volunteers this month",
  },
  {
    icon: Users,
    text: "1,200+ active volunteers nationwide",
  },
  {
    icon: Star,
    text: "4.8 average volunteer rating",
  },
]

export function GradientPanel() {
  return (
    <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-amber-600 to-orange-700 p-12 text-white">
      <div className="relative z-10 flex flex-col justify-center flex-1 gap-8">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-balance text-white">
            Welcome Back, Volunteer
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-amber-100">
            Login to track your earnings, view the leaderboard, and redeem
            coins.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {stats.map((stat) => (
            <div
              key={stat.text}
              className="flex items-center gap-3 rounded-xl bg-white/15 px-5 py-4 backdrop-blur-sm"
            >
              <stat.icon className="h-5 w-5 shrink-0 text-amber-200" />
              <span className="text-sm font-medium text-white">{stat.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div
        className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10"
        aria-hidden="true"
      />
    </div>
  )
}
