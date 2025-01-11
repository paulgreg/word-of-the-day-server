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
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const filename = `${d.getFullYear()}-${month}-${day}-${removeDangerousCharacters(w)}.json`
    try {
        const output: PersistedDataType = { word, date: d.toUTCString(), results }
        fs.writeFileSync(`./data/words/${filename}`, JSON.stringify(output, null, 0))
    } catch (err) {
        console.error('generateOutputText', err)
    }
}
