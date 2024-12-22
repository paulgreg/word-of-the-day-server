import fs from 'fs'
import express from 'express'
import { getRandomWordFromList } from './words'
import { translate } from './translations'
import { generateOutputText } from './output'
import type { OutputType } from './output'
import { ALPHA_AND_DATE_ONLY, removeDangerousCharacters } from './string'

const PORT = process.env.PORT ?? 3002

const ONE_HOUR = 60 * 60

const app = express()
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.static('public'))

const head = (data: Array<string>) => (data?.length > 0 ? data[0] : '')

app.get('/', async (req, res, next) => {
    try {
        const files = fs.readdirSync('./data/words').reverse()
        const names = files.map((filename) => {
            const name = filename.substring(0, filename.indexOf('.json'))
            const parts = name.split('-')
            const title = `${parts[2]}/${parts[1]}/${parts[0]} : ${parts[3]}`

            return { name, title }
        })
        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('index.ejs', { names })
    } catch (e) {
        next(e)
    }
})

app.get('/words/:filename', async (req, res, next) => {
    try {
        const { filename } = req.params
        const cleanFilename = removeDangerousCharacters(filename, ALPHA_AND_DATE_ONLY)
        const path = `./data/words/${cleanFilename}.json`
        console.info('file access:', path)
        const file = fs.readFileSync(path)
        const data: OutputType = JSON.parse(file.toString())
        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('word.ejs', data)
    } catch (e) {
        next(e)
    }
})

app.get('/random-word.json', async (req, res) => {
    const { word, w } = getRandomWordFromList()

    const frenchResult = await translate(w, 'french')
    const spanishResult = await translate(w, 'spanish')
    const italianResult = await translate(w, 'italian')
    const portugueseResult = await translate(w, 'portuguese')

    const response = {
        english: word,
        french: head(frenchResult?.translations),
        spanish: head(spanishResult?.translations),
        italian: head(italianResult?.translations),
        portuguese: head(portugueseResult?.translations),
    }

    res.setHeader('Cache-Control', ONE_HOUR)
    res.send(response)

    await generateOutputText(word, w, [frenchResult, spanishResult, italianResult, portugueseResult])
})

app.listen(PORT, () => {
    return console.log(`Word of the day is listening at http://localhost:${PORT}`)
})
