import fs from 'fs'
import { removeDangerousCharacters } from './string'

export type OutputType = {
    word: string
    date: string
    results: Array<ReversoResponse>
}

export const generateOutputText = async (word: string, w: string, results: Array<ReversoResponse>) => {
    const missingTranslation = results.filter((result) => result.translations.length === 0)
    if (missingTranslation.length > 0) {
        console.warn(`${missingTranslation.length} missing translation. No output`)
        return
    }

    const d = new Date()
    const filename = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${removeDangerousCharacters(w)}.json`
    try {
        const output: OutputType = { word, date: d.toUTCString(), results }
        fs.writeFileSync(`./data/words/${filename}`, JSON.stringify(output, null, 0))
    } catch (err) {
        console.error('generateOutputText', err)
    }
}
