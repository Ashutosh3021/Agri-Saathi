"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/profile')
const initialProfile = {
  name: "Rahul Sharma",
  phone: "+91 98765 43210",
  email: "rahul.sharma@email.com",
  district: "Patna",
  state: "Bihar",
  bio: "Passionate about improving farming practices in rural Bihar. Active volunteer since 2025.",
}

export default function SettingsPage() {
  const [profile, setProfile] = useState(initialProfile)
  const [notifications, setNotifications] = useState({
    scanUpdates: true,
    coinAlerts: true,
    leaderboardChanges: false,
    newFeatures: true,
    smsAlerts: false,
  })

  const handleProfileChange = (
    field: keyof typeof initialProfile,
    value: string
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 text-xl font-bold text-white">
                  RS
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground"
                >
                  Change Photo
                </Button>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-foreground">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                />
              </div>

              {/* Email - disabled */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {/* District / State */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm text-foreground">
                    District
                  </Label>
                  <Input
                    id="district"
                    value={profile.district}
                    onChange={(e) =>
                      handleProfileChange("district", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm text-foreground">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) =>
                      handleProfileChange("state", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm text-foreground">
                  Bio / Motivation
                </Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  rows={3}
                />
              </div>

              <Button className="bg-amber-600 text-white hover:bg-amber-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {[
                {
                  key: "scanUpdates" as const,
                  label: "Scan Updates",
                  description: "Get notified when your scan results are ready",
                },
                {
                  key: "coinAlerts" as const,
                  label: "Coin Alerts",
                  description: "Notifications for coin earned and milestones",
                },
                {
                  key: "leaderboardChanges" as const,
                  label: "Leaderboard Changes",
                  description:
                    "Alert when your rank changes on the leaderboard",
                },
                {
                  key: "newFeatures" as const,
                  label: "New Features",
                  description: "Stay updated on new platform features",
                },
                {
                  key: "smsAlerts" as const,
                  label: "SMS Alerts",
                  description: "Receive important alerts via SMS",
                },
              ].map((item, i) => (
                <div
                  key={item.key}
                  className={cn(
                    "flex items-center justify-between py-4",
                    i !== 4 && "border-b border-border/50"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: checked,
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium text-foreground">
                  Change Password
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Update your password to keep your account secure
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-border text-foreground"
                >
                  Update Password
                </Button>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium text-foreground">
                  Language Preference
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Currently set to English. Multi-language support coming soon.
                </p>
              </div>

              <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <h3 className="text-sm font-medium text-destructive">
                  Delete Account
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Permanently delete your volunteer account and all associated
                  data
                </p>
                <Button variant="destructive" size="sm" className="mt-3">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
