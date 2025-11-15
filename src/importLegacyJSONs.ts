import fs from 'fs'
import { insertWord } from './utils/db'
import { getDateStr } from './utils/date'
import { extractOnlyWord } from './words'

export type PersistedLanguageType = {
    lang: string
    word: string
}
export type PersistedDataType = {
    word: string
    date: string
    results: Array<PersistedLanguageType>
}

const files = fs.readdirSync('./data/words').reverse()
for (const filename of files) {
    const path = `./data/words/${filename}`
    console.info('file access:', path)
    const file = fs.readFileSync(path)
    const data: PersistedDataType = JSON.parse(file.toString())

    const { word, date, results } = data
    const fr = results[0].word
    const es = results[1].word
    const it = results[2].word
    const pt = results[3].word

    const d = new Date(date)
    const dateStr = getDateStr(d)

    const wordRecord = {
        w: extractOnlyWord(word),
        word,
        date: dateStr,
        fr,
        es,
        it,
        pt,
    }
    console.log('inserting', wordRecord)
    insertWord(wordRecord)
}
