import express, { Request, Response, NextFunction } from 'express'
import { convertToHexEscapedString } from './utils/string.js'
import { getWordByW, listWordsByLetter, listLetters } from './utils/db.js'
import { extractOnlyWord, getRandomWordFromList } from './utils/words.js'

const PORT = process.env.PORT ?? 3002

const ONE_HOUR = 60 * 60

const rootURL = process.env.ROOT_URL ?? '/'

const app = express()

app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.static('public'))

app.get('/', (_req: Request, res: Response, next: NextFunction) => {
    try {
        const wordOfTheDay = getRandomWordFromList(new Date())
        const wordRecord = getWordByW(wordOfTheDay.w)
        const letters = listLetters()

        if (!wordRecord) {
            res.status(404).send('Word not found').end()
            return
        }

        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('index.ejs', { rootURL, letters, ...wordRecord, w: extractOnlyWord(wordRecord.word) })
        return
    } catch (e) {
        next(e)
    }
})

app.get('/word-of-the-day.json', (_req: Request, res: Response, next: NextFunction) => {
    try {
        const d = new Date()
        const { w } = getRandomWordFromList(d)

        let wordRecordFromDb = getWordByW(w)

        if (wordRecordFromDb) {
            const { word, fr, es, it, pt, jp } = wordRecordFromDb
            const w = extractOnlyWord(word)

            res.setHeader('Cache-Control', ONE_HOUR)
            res.send({
                languages: ['en:', 'fr:', 'es:', 'it:', 'pt:', 'jp:'],
                translations: [
                    w,
                    convertToHexEscapedString(fr),
                    convertToHexEscapedString(es),
                    convertToHexEscapedString(it),
                    convertToHexEscapedString(pt),
                    convertToHexEscapedString(jp),
                ],
            })
        } else {
            res.status(404).send('not found').end()
        }
    } catch (e) {
        next(e)
    }
})

app.get('/word/:w', (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { w } = _req.params
        const word = getWordByW(w)
        if (!word) {
            res.status(404).send('Word not found').end()
            return
        }
        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('word.ejs', { rootURL, letters: listLetters(), ...word })
    } catch (e) {
        next(e)
    }
})

app.get('/:letter', (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { letter } = _req.params
        const words = listWordsByLetter(letter.toLowerCase())
        const letters = listLetters()

        if (words.length === 0) {
            res.status(404).send('No words found for this letter').end()
            return
        }

        const letterWords = words.map(({ w, word }) => ({ w, word }))

        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('letter.ejs', { rootURL, letter, words: letterWords, letters })
    } catch (e) {
        next(e)
    }
})

app.listen(PORT, () => {
    return console.log(`Word of the day is listening at http://localhost:${PORT} - rootUrl=${rootURL}`)
})
