import fs from 'fs'
const WORDS_FILE = './data/words.txt'
const WORDS: Array<string> = fs.readFileSync(WORDS_FILE, 'utf8').split('\n')

if (process.env.DEBUG) {
    console.log(`${WORDS.length} words loaded`)
}

export const extractOnlyWord = (word: string) => word.split(' ')[0]

const getRandomNumberForToday = (d: Date, min: number, max: number) => {
    const firstDay = new Date(d.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((d.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24))
    const seed = dayOfYear

    // Generate a random number based on the seed and the provided range
    const random = Math.sin(seed) * 10000
    const boundedRandom = Math.floor((random - Math.floor(random)) * (max - min + 1)) + min

    return boundedRandom
}

export const getRandomWordFromList = (d: Date) => {
    const random = getRandomNumberForToday(d, 0, WORDS.length)
    const word = WORDS[random]
    return { word, w: extractOnlyWord(word) }
}

export const convertToHexEscapedString = (input: string) => {
    let result = ''

    for (let i = 0; i < input.length; i++) {
        const char = input[i]
        const charCode = input.codePointAt(i)
        if (!charCode) throw new Error('no code point')

        if (charCode > 127) {
            // if character is a non-ASCII character
            // Convert to hexadecimal and escape it as \xNN format
            result += String.raw`\x` + charCode.toString(16).padStart(2, '0')
        } else {
            // If ASCII character, add it directly to the result
            result += char
        }
    }

    return result
}
