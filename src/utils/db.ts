import { DatabaseSync } from 'node:sqlite'
import type { ShortWordType, WordRecordType } from '../types'

const path = './data/words.db'

const db = new DatabaseSync(path)

export const initDb = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS words (
w TEXT NOT NULL PRIMARY KEY,
word TEXT NOT NULL,
date TEXT NOT NULL,
fr TEXT NOT NULL,
es TEXT NOT NULL,
it TEXT NOT NULL,
pt TEXT NOT NULL)`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_words_date_key ON words(date)`)
}

export const insertWord = async (record: WordRecordType) => {
    const { w, word, date, fr, es, it, pt } = record
    const insert = db.prepare('INSERT INTO words (w, word, date, fr, es, it, pt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    insert.run(w, word, date, fr, es, it, pt)
}

export const listWordsByDate = (): Array<ShortWordType> => {
    const query = db.prepare('SELECT w, word, date FROM words ORDER BY date DESC')
    return query.all() as Array<ShortWordType>
}

export const getWordByDate = (dateStr: string): WordRecordType | undefined => {
    const query = db.prepare('SELECT * FROM WORDS WHERE date = $dateStr')
    const r = query.get({ $dateStr: dateStr })
    if (r) return r as WordRecordType
}

export const getWordByW = (w: string): WordRecordType | undefined => {
    const query = db.prepare('SELECT * FROM WORDS WHERE w = $w')
    const r = query.get({ $w: w })
    if (r) return r as WordRecordType
}
