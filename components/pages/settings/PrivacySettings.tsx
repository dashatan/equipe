import React from 'react'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Shield } from 'lucide-react'
import { settingsConstants } from './constants'

interface PrivacySettingsProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

export function PrivacySettings({ settings, onSettingChange }: PrivacySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Privacy Controls
        </CardTitle>
        <CardDescription>
          Control who can see your information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="profileVisibility">Profile Visibility</Label>
          <Select 
            value={settings.profileVisibility}
            onValueChange={(value) => onSettingChange('profileVisibility', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {settingsConstants.profileVisibilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Show Online Status</p>
            <p className="text-sm text-muted-foreground">
              Let others see when you're online
            </p>
          </div>
          <Switch
            checked={settings.showOnlineStatus}
            onCheckedChange={(checked) => onSettingChange('showOnlineStatus', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Show Last Seen</p>
            <p className="text-sm text-muted-foreground">
              Display when you were last active
            </p>
          </div>
          <Switch
            checked={settings.showLastSeen}
            onCheckedChange={(checked) => onSettingChange('showLastSeen', checked)}
          />
        </div>

        <div>
          <Label htmlFor="allowMessages">Who can message you</Label>
          <Select 
            value={settings.allowMessages}
            onValueChange={(value) => onSettingChange('allowMessages', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {settingsConstants.messagePermissionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}