export const settingsConstants = {
  profileVisibilityOptions: [
    { value: 'public', label: 'Public' },
    { value: 'friends', label: 'Friends Only' },
    { value: 'private', label: 'Private' }
  ],
  
  messagePermissionOptions: [
    { value: 'everyone', label: 'Everyone' },
    { value: 'friends', label: 'Friends Only' },
    { value: 'none', label: 'No One' }
  ],
  
  languageOptions: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ],
  
  sessionTimeoutOptions: [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: 'never', label: 'Never' }
  ]
}

export const defaultSettings = {
  // Privacy settings
  profileVisibility: 'public',
  showOnlineStatus: true,
  showLastSeen: true,
  allowMessages: 'everyone',
  
  // Notification settings
  pushNotifications: true,
  emailNotifications: true,
  messageNotifications: true,
  groupNotifications: true,
  eventNotifications: true,
  
  // Discovery settings
  discoverability: true,
  searchRadius: [10],
  ageRange: [18, 35],
  
  // Account settings
  twoFactorEnabled: false,
  sessionTimeout: '30',
}