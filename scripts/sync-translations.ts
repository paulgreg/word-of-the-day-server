import 'dotenv/config'
import { extractOnlyWord } from '../src/words.js'
import { getWordByW } from '../src/utils/db.js'
import { translate } from '../src/utils/ia.js'
import { WordRecordType } from '../src/types.js'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

const today = new Date()
const dateStr = today.toISOString().slice(0, 10)

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

async function main() {
    const fs = await import('node:fs')
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
          const translatedWordRecord = await translate(word, line, dateStr)
          if (translatedWordRecord) {
            const { insertWord } = await import('../src/utils/db.js')
            insertWord(translatedWordRecord)
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
