import express, { type Response } from 'express'
import { convertToHexEscapedString, extractOnlyWord, getRandomWordFromList } from './words'
import { getWordByW, insertWord, listWordsByDate } from './utils/db'
import { convertDateToFR, getDateStr } from './utils/date'
import { translate } from './utils/ia'
import { WordRecordType } from './types'
import 'dotenv/config'

const PORT = process.env.PORT ?? 3002

const ONE_HOUR = 60 * 60

const app = express()
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.static('public'))

app.get('/', async (req, res, next) => {
    try {
        const words = listWordsByDate().map(({ w, word, date }) => ({
            w,
            word,
            date,
            title: `${convertDateToFR(date)} : ${word}`,
        }))
        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('index.ejs', { words })
    } catch (e) {
        next(e)
    }
})

app.get('/words/:w', async (req, res, next) => {
    try {
        const { w } = req.params
        const wordRecord = getWordByW(w)
        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('word.ejs', wordRecord)
    } catch (e) {
        next(e)
    }
})

const sendWordOfTheDay = (wordRecord: WordRecordType, res: Response) => {
    const { word, fr, es, it, pt } = wordRecord
    const w = extractOnlyWord(word)

    res.setHeader('Cache-Control', ONE_HOUR)
    res.send({
        languages: ['en:', 'fr:', 'es:', 'it:', 'pt:'],
        translations: [
            w,
            convertToHexEscapedString(fr),
            convertToHexEscapedString(es),
            convertToHexEscapedString(it),
            convertToHexEscapedString(pt),
        ],
    })
}

app.get('/word-of-the-day.json', async (req, res, next) => {
    try {
        const d = new Date()
        const today = getDateStr(d)
        const { w, word } = getRandomWordFromList(d)

        let wordRecordFromDb = getWordByW(w)

        if (wordRecordFromDb) {
            return sendWordOfTheDay(wordRecordFromDb, res)
        } else {
            const translatedWordRecord = await translate(w, word, today)
            if (translatedWordRecord) {
                insertWord(translatedWordRecord)
                return sendWordOfTheDay(translatedWordRecord, res)
            } else {
                res.send(503)
            }
        }
    } catch (e) {
        next(e)
    }
})

app.listen(PORT, () => {
    return console.log(`Word of the day is listening at http://localhost:${PORT}`)
})
