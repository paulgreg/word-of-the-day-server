import fs from 'fs'
import express from 'express'
import type { PersistedDataType } from './write'
import { ALPHA_AND_DATE_ONLY, removeDangerousCharacters } from './string'
import { convertToHexEscapedString, extractOnlyWord } from './words'

const PORT = process.env.PORT ?? 3002

const ONE_HOUR = 60 * 60

const app = express()
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.static('public'))

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
        const data: PersistedDataType = JSON.parse(file.toString())
        res.setHeader('Cache-Control', ONE_HOUR)
        res.render('word.ejs', data)
    } catch (e) {
        next(e)
    }
})

app.get('/word-of-the-day.json', async (req, res, next) => {
    try {
        const files = fs.readdirSync('./data/words').reverse()
        if (files.length === 0 || !files[0].endsWith('.json')) {
            res.send(503)
        }
        const file = fs.readFileSync(`./data/words/${files[0]}`)
        const data: PersistedDataType = JSON.parse(file.toString())
        const results = data.results.slice(0, 4)
        const languages = results.map(({ lang }) => `${lang}:`)
        const translations = results.map(({ word }) => word).map((word) => convertToHexEscapedString(word))

        const w = extractOnlyWord(data.word)

        res.setHeader('Cache-Control', ONE_HOUR)
        res.send({
            languages: ['en:'].concat(languages),
            translations: [w].concat(translations),
        })
    } catch (e) {
        next(e)
    }
})

app.listen(PORT, () => {
    return console.log(`Word of the day is listening at http://localhost:${PORT}`)
})
