import { DatabaseSync } from 'node:sqlite'
import { db } from '../utils/db.js'

export const initDb = (db: DatabaseSync) => {
    db.exec(`CREATE TABLE IF NOT EXISTS words (
w TEXT NOT NULL PRIMARY KEY,
word TEXT NOT NULL,
fr TEXT NOT NULL,
es TEXT NOT NULL,
it TEXT NOT NULL,
pt TEXT NOT NULL,
jp TEXT NOT NULL)`)
}

initDb(db)
console.log('db created')
