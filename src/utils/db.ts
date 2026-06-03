import { DatabaseSync } from 'node:sqlite'
import type { ShortWordType, WordRecordType } from '../types.js'

const path = './data/words.db'

export const db = new DatabaseSync(path)

export const listAllWords = (): Array<ShortWordType> => {
    const query = db.prepare('SELECT w, word FROM words ORDER BY word')
    return query.all() as Array<ShortWordType>
}

export const getWordByW = (w: string): WordRecordType | undefined => {
    const query = db.prepare('SELECT w, word, fr, es, it, pt, jp FROM words WHERE w = $w')
    const r = query.get({ $w: w })
    if (r) return r as WordRecordType
}

export const listWordsByLetter = (letter: string): Array<ShortWordType> => {
    const query = db.prepare('SELECT w, word FROM words WHERE word LIKE $letter ORDER BY word')
    return query.all({ $letter: letter + '%' }) as Array<ShortWordType>
}

export const listLetters = (): string[] => {
    const query = db.prepare('SELECT DISTINCT lower(substr(word, 1, 1)) as letter FROM words ORDER BY letter')
    const result = query.all() as Array<{ letter: string }>
    return result.map((r) => r.letter)
}
