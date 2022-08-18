import { createI18n } from 'vue-i18n'
// @ts-ignore
import en from '../locales/en.json'
import vi from '../locales/vi.json'

type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'vi'>({
    legacy: false,
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale,
    messages: {
        en,
        vi
    }
})

export default i18n
