import { writeResult } from './write'
import { getRandomWordFromList } from './words'
import translate from 'translate'

translate.engine = 'deepl'
translate.key = process.env.DEEPL_KEY

const { word, w } = getRandomWordFromList()

try {
    const french = await translate(w, 'fr')
    const spanish = await translate(w, 'es')
    const italian = await translate(w, 'it')
    const portuguese = await translate(w, 'pt')
    const german = await translate(w, 'de')

    await writeResult(word, w, [
        { lang: 'fr', word: french },
        { lang: 'es', word: spanish },
        { lang: 'it', word: italian },
        { lang: 'pt', word: portuguese },
        { lang: 'de', word: german },
    ])
} catch (e) {
    console.error(e)
    process.exit(1)
}
