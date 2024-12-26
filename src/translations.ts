import Reverso from 'reverso-api'
const reverso = new Reverso()

const WAIT_DELAY = 500

const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

const translate = async (word: string, targetLanguage: string): Promise<ReversoResponse> => {
    const result = await reverso.getContext(word, 'english', targetLanguage)
    if (process.env.DEBUG) console.log(result)
    if (!result.ok)
        return { ok: false, text: word, source: 'english', target: targetLanguage, translations: [], examples: [] }
    return {
        ...result,
        translations: result.translations.filter((t) => t.length > 0),
        examples: result.examples.slice(0, 5),
    }
}

export const translateWithRetry = async (word: string, language: string, maxRetries = 5) => {
    let result: ReversoResponse | undefined = undefined
    let c = 1

    do {
        let delay = WAIT_DELAY * c++
        if (process.env.DEBUG) console.log(`translateWithRetry: try ${c}/${maxRetries}, waiting ${delay}`)
        wait(delay)
        result = await translate(word, language)
        if (c > maxRetries) throw new Error(`fail to translate ${word} in ${language}`)
    } while (!result.ok || !result?.translations?.length || !result?.examples?.length)

    return result
}
