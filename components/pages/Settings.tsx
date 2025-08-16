import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { AccountSettings } from './settings/AccountSettings'
import { PrivacySettings } from './settings/PrivacySettings'
import { NotificationSettings } from './settings/NotificationSettings'
import { DiscoverySettings } from './settings/DiscoverySettings'
import { SecuritySettings } from './settings/SecuritySettings'
import { defaultSettings } from './settings/constants'

export function Settings() {
  const [settings, setSettings] = useState(defaultSettings)

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log('Settings saved:', settings)
  }

  const handleDeleteAccount = () => {
    console.log('Delete account requested')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and privacy settings
          </p>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </motion.div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AccountSettings />
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <PrivacySettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NotificationSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <DiscoverySettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SecuritySettings 
              settings={settings} 
              onSettingChange={handleSettingChange}
              onDeleteAccount={handleDeleteAccount}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}