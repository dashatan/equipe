import en from './locales/en.json'
import fr from './locales/fr.json'
import fa from './locales/fa.json'
import ar from './locales/ar.json'
import { signal, computed } from '@preact/signals-react'

export const locale = signal<string>('en')

// Type utilities for nested keys
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

// Enhanced type that preserves nested structure AND allows any string key
type EnhancedLocaleType<T extends object> = T & {
  [K in NestedKeyOf<T>]: string
} & {
  [key: string]: string | undefined
}

// Type definition based on the locale JSON structure
type LocaleType = EnhancedLocaleType<typeof en>

// Create enhanced proxy for better autocomplete
const createEnhancedProxy = <T extends Record<string, any>>(obj: T): EnhancedLocaleType<T> => {
  const getNestedValue = (target: any, path: string): any => {
    const keys = path.split('.')
    let value = target
    for (const key of keys) {
      if (value === null || value === undefined) return undefined
      value = value[key]
    }
    return value
  }

  const getAllKeys = (obj: any, prefix = ''): string[] => {
    const keys: string[] = []
    for (const key in obj) {
      const newPrefix = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(...getAllKeys(obj[key], newPrefix))
      } else {
        keys.push(newPrefix)
      }
    }
    return keys
  }

  const allKeys = getAllKeys(obj)

  return new Proxy(obj, {
    get(target, prop) {
      const propStr = String(prop)
      
      // If property exists directly, return it (with proxy if it's an object)
      if (propStr in target) {
        const value = target[propStr]
        if (typeof value === 'object' && value !== null) {
          return createEnhancedProxy(value)
        }
        return value
      }

      // Check if it's a dot-notation path
      const nestedValue = getNestedValue(target, propStr)
      if (nestedValue !== undefined) {
        return nestedValue
      }

      // Fuzzy search for suggestions
      const suggestions = allKeys
        .filter(k => k.toLowerCase().includes(propStr.toLowerCase()))
        .slice(0, 5)
      
      if (suggestions.length > 0) {
        console.warn(`"${propStr}" not found. Did you mean: ${suggestions.join(', ')}?`)
      }

      return undefined
    }
  }) as EnhancedLocaleType<T>
}

// Create a reactive translation function that updates when locale changes
const translations = computed((): LocaleType => {
  console.log('locale', locale.value);
  switch (locale.value) {
    case 'en':
      return createEnhancedProxy(en) as LocaleType
    case 'fr':
      return createEnhancedProxy(fr) as LocaleType
    case 'fa':
      return createEnhancedProxy(fa) as LocaleType
    case 'ar':
      return createEnhancedProxy(ar) as LocaleType
    default:
      return createEnhancedProxy(en) as LocaleType
  }
})

// Create a proxy that always returns the current translations
const t = new Proxy({} as LocaleType, {
  get(target, prop) {
    return translations.value[prop as keyof LocaleType]
  }
})

export default t
