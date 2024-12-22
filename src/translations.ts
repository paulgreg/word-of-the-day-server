import Reverso from 'reverso-api'
const reverso = new Reverso()

const WAIT_DELAY = 1_000

const wait = () => new Promise((resolve) => setTimeout(resolve, WAIT_DELAY))

export const translate = async (word: string, targetLanguage: string): Promise<ReversoResponse> => {
    await wait()
    const result = await reverso.getContext(word, 'english', targetLanguage)
    if (process.env.DEBUG) console.log(result)
    if (!result.ok)
        return { ok: false, text: word, source: 'english', target: targetLanguage, translations: [], examples: [] }
    return {
        ...result,
        translations: result.translations.filter((t) => t.length > 0),
    }
}
