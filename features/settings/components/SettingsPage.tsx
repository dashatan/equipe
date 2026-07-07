'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Settings as SettingsIcon, Moon, Sun, Bell, Lock, Save, LogOut } from 'lucide-react'
import { useTheme } from '@/features/theme/contexts/ThemeContext'
import { useAuth } from '@/features/auth/contexts/AuthContext'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { logout, user } = useAuth()
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    pushNotifs: false,
    activityReminders: true,
    weeklyDigest: false,
  })
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPwd, setSavingPwd] = useState(false)

  const changePassword = async () => {
    if (pwd.newPassword !== pwd.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setSavingPwd(true)
    try {
      const res = await fetch('/api/users/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed')
      }
      toast.success('Password changed!')
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to change password')
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your preferences and account</p>
        </div>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Dark mode</div>
              <div className="text-xs text-muted-foreground">Toggle between light and dark theme</div>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrefRow label="Email notifications" desc="Receive emails about activity" checked={prefs.emailNotifs} onChange={(v) => setPrefs({ ...prefs, emailNotifs: v })} />
          <PrefRow label="Push notifications" desc="Get push alerts in your browser" checked={prefs.pushNotifs} onChange={(v) => setPrefs({ ...prefs, pushNotifs: v })} />
          <PrefRow label="Activity reminders" desc="Reminders before your activities" checked={prefs.activityReminders} onChange={(v) => setPrefs({ ...prefs, activityReminders: v })} />
          <PrefRow label="Weekly digest" desc="A summary of your week every Monday" checked={prefs.weeklyDigest} onChange={(v) => setPrefs({ ...prefs, weeklyDigest: v })} />
          <Button variant="outline" size="sm" onClick={() => toast.success('Preferences saved')}>
            <Save className="h-4 w-4 mr-2" /> Save preferences
          </Button>
        </CardContent>
      </Card>

      {/* Account / Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Lock className="h-5 w-5" /> Security</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cur">Current password</Label>
            <Input id="cur" type="password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conf">Confirm new</Label>
              <Input id="conf" type="password" value={pwd.confirmPassword} onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })} />
            </div>
          </div>
          <Button onClick={changePassword} disabled={savingPwd || !pwd.currentPassword || !pwd.newPassword}>
            {savingPwd ? 'Updating...' : 'Update password'}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Sign out</CardTitle>
          <CardDescription>End your current session</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out{user?.email ? ` (${user.email})` : ''}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PrefRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
