import React from 'react'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Slider } from '../../ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Compass } from 'lucide-react'

interface DiscoverySettingsProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

export function DiscoverySettings({ settings, onSettingChange }: DiscoverySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Compass className="h-5 w-5 mr-2" />
          Discovery Preferences
        </CardTitle>
        <CardDescription>
          Control how others can find you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Make me discoverable</p>
            <p className="text-sm text-muted-foreground">
              Allow others to find your profile in search
            </p>
          </div>
          <Switch
            checked={settings.discoverability}
            onCheckedChange={(checked) => onSettingChange('discoverability', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>Search Radius: {settings.searchRadius[0]} miles</Label>
          <Slider
            value={settings.searchRadius}
            onValueChange={(value) => onSettingChange('searchRadius', value)}
            max={50}
            min={1}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Age Range: {settings.ageRange[0]} - {settings.ageRange[1]} years</Label>
          <Slider
            value={settings.ageRange}
            onValueChange={(value) => onSettingChange('ageRange', value)}
            max={65}
            min={18}
            step={1}
          />
        </div>
      </CardContent>
    </Card>
  )
}