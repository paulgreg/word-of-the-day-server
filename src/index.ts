import express from 'express'
import fs from 'fs'
import Reverso from 'reverso-api'

const PORT = process.env.PORT ?? 3002

const DEBUG = process.env.DEBUG ?? false

const WORDS_FILE = './data/words.txt'

const reverso = new Reverso()

const app = express()

const WORDS: Array<string> = fs.readFileSync(WORDS_FILE, 'utf8').split('\n')

const WAIT_DELAY = 1000

console.log(`${WORDS.length} words loaded`)

const getRandomWordFromList = () => {
    const random = Math.round(Math.random() * WORDS.length)
    return WORDS[random]
}
const extractOnlyWord = (word: string) => word.split(' ')[0]

const head = (data: Array<string>) => (data?.length > 0 ? data[0] : '')

const wait = () => new Promise((resolve) => setTimeout(resolve, Math.random() * WAIT_DELAY + 500))

const translate = async (word: string, targetLanguage: string) => {
    await wait() // wait a little bit
    const result = await reverso.getContext(word, 'english', targetLanguage)
    if (DEBUG) console.log(result)
    return result.ok ? head(result.translations) : ''
}

app.get('/random-word.json', async (req, res) => {
    const word = getRandomWordFromList()
    const w = extractOnlyWord(word)
    const response = {
        english: word,
        french: await translate(w, 'french'),
        spanish: await translate(w, 'spanish'),
        italian: await translate(w, 'italian'),
        portuguese: await translate(w, 'portuguese'),
    }
    res.send(response)
})

app.listen(PORT, () => {
    return console.log(`Word of the day is listening at http://localhost:${PORT}`)
})
