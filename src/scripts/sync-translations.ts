import { extractOnlyWord } from '../utils/words.js'
import { db, getWordByW } from '../utils/db.js'
import { translate } from './ia.js'
import { WordRecordType } from '../types.js'
import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'

if (!process.env.AI_GATEWAY_API_KEY) {
    console.error('missing key')
    process.exit(1)
}

if (!process.env.LLM_MODEL) {
    console.error('missing key')
    process.exit(1)
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

const stats = {
    total: 0,
    alreadyTranslated: 0,
    needsTranslation: 0,
    translated: 0,
    skipped: 0,
    }
const skippedWords: string[] = []
let consecutiveErrors = 0
const MAX_CONSECUTIVE_ERRORS = 10

const insertWord = async (db: DatabaseSync, record: WordRecordType) => {
    const { w, word, fr, es, it, pt, jp } = record
    const insert = db.prepare('INSERT INTO words (w, word, fr, es, it, pt, jp) VALUES (?, ?, ?, ?, ?, ?, ?)')
    insert.run(w, word, fr, es, it, pt, jp)
}

async function main() {
    const content = fs.readFileSync('./data/words.txt', 'utf-8')
    const lines = content.split('\n').filter((line) => line.trim())

    for (const line of lines) {
        stats.total++
        const word = extractOnlyWord(line)
        const existing = getWordByW(word)

        if (existing) {
            stats.alreadyTranslated++
        } else {
            stats.needsTranslation++

            if (!dryRun) {
                try {
                    const translatedWordRecord = await translate(word, line)
                    if (translatedWordRecord) {
                        insertWord(db, translatedWordRecord)
                        stats.translated++
                    }
                } catch (e) {
                    stats.skipped++
                    consecutiveErrors++
                    skippedWords.push(word)

                    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                        console.error(`\nStopping after ${MAX_CONSECUTIVE_ERRORS} consecutive errors`)
                        console.error(`Total skipped: ${stats.skipped}`)
                        process.exit(1)
                    }
                }
            }
        }
    }

    console.log('=== Translation Sync Results ===')
    console.log('Words in list:', stats.total)
    console.log('Already translated:', stats.alreadyTranslated)
    console.log('Needs translation:', stats.needsTranslation)
    console.log('Successfully added:', stats.translated)
    console.log('Skipped (error):', stats.skipped)
    console.log('Consecutive errors:', consecutiveErrors)

    if (stats.skipped > 0) {
        console.log('\nSkipped words:')
        for (const word of skippedWords) {
            console.log(`  - ${word}`)
        }
    }

    if (stats.skipped > 0) {
        process.exit(1)
    }
}

main()
