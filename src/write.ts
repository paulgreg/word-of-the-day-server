import fs from 'fs'
import { removeDangerousCharacters } from './string'

export type PersistedLanguageType = {
    lang: string
    word: string
}
export type PersistedDataType = {
    word: string
    date: string
    results: Array<PersistedLanguageType>
}

export const writeResult = async (word: string, w: string, results: Array<PersistedLanguageType>) => {
    const d = new Date()
    const filename = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${removeDangerousCharacters(w)}.json`
    try {
        const output: PersistedDataType = { word, date: d.toUTCString(), results }
        fs.writeFileSync(`./data/words/${filename}`, JSON.stringify(output, null, 0))
    } catch (err) {
        console.error('generateOutputText', err)
    }
}
