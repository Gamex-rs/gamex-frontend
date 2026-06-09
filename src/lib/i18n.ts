import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import srLatn from '@/locales/sr-Latn.json'

i18n.use(initReactI18next).init({
  lng: 'sr-Latn',
  fallbackLng: 'sr-Latn',
  resources: {
    'sr-Latn': { translation: srLatn },
  },
  interpolation: { escapeValue: false },
})

export default i18n
