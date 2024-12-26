import { writeResult } from './write'
import { translateWithRetry } from './translations'
import { getRandomWordFromList } from './words'

const { word, w } = getRandomWordFromList()

try {
    const frenchResult = await translateWithRetry(w, 'french')
    const spanishResult = await translateWithRetry(w, 'spanish')
    const italianResult = await translateWithRetry(w, 'italian')
    const portugueseResult = await translateWithRetry(w, 'portuguese')
    const germanResult = await translateWithRetry(w, 'german')

    await writeResult(word, w, [frenchResult, spanishResult, italianResult, portugueseResult, germanResult])
} catch (e) {
    console.error(e)
    process.exit(1)
}
