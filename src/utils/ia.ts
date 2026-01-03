import LLM, { Response } from '@themaximalist/llm.js'
import type { WordRecordType } from '../types'

export const translate = async (w: string, word: string, dateStr: string): Promise<WordRecordType | undefined> => {
    try {
        console.info('translate', w)
        const llm = new LLM({
            service: 'openai',
            model: 'gpt-4',
            extended: true,
        })
        llm.system(
            'You are a translator that translate a word of the day in different languages in that order : French, Spanish, Italian and Portuguese. You should only respond with one answer per language per line, without the language, without explanation. All translations should have the same meaning.'
        )
        const response = (await llm.chat(`translate: ${w}`)) as Response

        if (!response.content) throw new Error('no result')

        console.debug(response.usage)

        const translations = response.content.split('\n').map((w) => w.trim())
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
