import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"

export default async function SettingsPage() {
  const session = await getSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your admin account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{session?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Role</p>
            <p className="text-sm text-muted-foreground capitalize">{session?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
