import type { WordRecordType } from '../types.js'
import { createMistral, type MistralLanguageModelOptions } from '@ai-sdk/mistral'
import { generateText, Output } from 'ai'
import { z } from 'zod'

const system = `You are a translator that translate a word of the day in different languages : fr/French, es/Spanish, it/Italian, pt/Portuguese.
Be concise. All translations should have the same meaning and be in lower case.`

export const translate = async (w: string, word: string, dateStr: string): Promise<WordRecordType | undefined> => {
    try {
        console.info('translate', w)

        const mistral = createMistral({
            apiKey: process.env.AI_GATEWAY_API_KEY,
        })
        const response = await generateText({
            model: mistral(process.env.LLM_MODEL ?? ''),
            providerOptions: {
                mistral: {
                    strictJsonSchema: true,
                } satisfies MistralLanguageModelOptions,
            },
            output: Output.object({
                schema: z.object({
                    fr: z.string(),
                    es: z.string(),
                    it: z.string(),
                    pt: z.string(),
                }),
            }),
            system,
            prompt: `translate: ${w}`,
        })

        if (!response.text) throw new Error('no result')

        console.debug(response.usage)

        const translations = response.output
        console.info(`Answer:`, translations)

        return {
            w,
            word,
            date: dateStr,
            ...translations,
        }
    } catch (e) {
        console.error(e)
    }
}
