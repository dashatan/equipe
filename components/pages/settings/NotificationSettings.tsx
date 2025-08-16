import React from 'react'
import { Switch } from '../../ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Bell, Smartphone, Mail } from 'lucide-react'

interface NotificationSettingsProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

export function NotificationSettings({ settings, onSettingChange }: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => onSettingChange('pushNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
          />
        </div>

        <div className="ml-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm">New Messages</p>
            <Switch
              checked={settings.messageNotifications}
              onCheckedChange={(checked) => onSettingChange('messageNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Group Activity</p>
            <Switch
              checked={settings.groupNotifications}
              onCheckedChange={(checked) => onSettingChange('groupNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Event Reminders</p>
            <Switch
              checked={settings.eventNotifications}
              onCheckedChange={(checked) => onSettingChange('eventNotifications', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}