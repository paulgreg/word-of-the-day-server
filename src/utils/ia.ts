import type { WordRecordType } from '../types'
import { generateText } from 'ai'
import { createMistral } from '@ai-sdk/mistral'

export const translate = async (w: string, word: string, dateStr: string): Promise<WordRecordType | undefined> => {
    try {
        console.info('translate', w)

        const mistral = createMistral({
            apiKey: process.env.AI_GATEWAY_API_KEY,
        })
        const response = await generateText({
            model: mistral(process.env.LLM_MODEL ?? ''),
            system: 'You are a translator that translate a word of the day in different languages in that order : French, Spanish, Italian and Portuguese. You should only respond with one answer per language per line, without the language, without explanation. All translations should have the same meaning.',
            prompt: `translate: ${w}`,
        })

        if (!response.text) throw new Error('no result')

        console.debug(response.usage)

        const translations = response.text.split('\n').map((w) => w.trim())
        console.info(`Answer:`, translations)

        if (translations.length != 4) throw new Error('No 4 answers')

        return {
            w,
            word,
            date: dateStr,
            fr: translations[0],
            es: translations[1],
            it: translations[2],
            pt: translations[3],
        }
    } catch (e) {
        console.error(e)
    }
}
