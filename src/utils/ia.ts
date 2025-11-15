import OpenAI from 'openai'
import type { WordRecordType } from '../types'
import { getDateStr } from './date'

export const translate = async (w: string, word: string): Promise<WordRecordType | undefined> => {
    try {
        console.info('translate', w)
        const openai = new OpenAI()
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            store: true,
            messages: [
                {
                    role: 'developer',
                    content:
                        'You are a translator that translate a word of the day in different languages in that order : French, Spanish, Italian and Portuguese. You should only respond with one answer per language per line, without explanation. All translations should have the same meaning.',
                },
                {
                    role: 'user',
                    content: `translate: ${w}`,
                },
            ],
        })

        if (completion.choices.length === 0) throw new Error('no result')
        const answer = completion.choices[0]
        if (!answer?.message?.content) throw new Error('No answer')

        const translations = answer.message.content.split('\n').map((w) => w.trim())
        console.info(`Answer:`, translations)

        if (translations.length != 4) throw new Error('No 4 answers')

        return {
            w,
            word,
            date: getDateStr(),
            fr: translations[0],
            es: translations[1],
            it: translations[2],
            pt: translations[3],
        }
    } catch (e) {
        console.error(e)
    }
}
