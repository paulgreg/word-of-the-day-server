import fs from 'fs'
const WORDS_FILE = './data/words.txt'
const WORDS: Array<string> = fs.readFileSync(WORDS_FILE, 'utf8').split('\n')

if (process.env.DEBUG) {
    console.log(`${WORDS.length} words loaded`)
}

const getRandomNumberForToday = (min: number, max: number) => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((today.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24))
    const seed = dayOfYear

    // Generate a random number based on the seed and the provided range
    const random = Math.sin(seed) * 10000
    const boundedRandom = Math.floor((random - Math.floor(random)) * (max - min + 1)) + min

    return boundedRandom
}

export const extractOnlyWord = (word: string) => word.split(' ')[0]

export const getRandomWordFromList = () => {
    const random = getRandomNumberForToday(0, WORDS.length)
    const word = WORDS[random]
    return { word, w: extractOnlyWord(word) }
}
