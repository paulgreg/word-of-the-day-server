import { getRandomNumberForToday } from './math.js'
import { listAllWords } from './db.js'
import type { ShortWordType } from '../types.js'

export const extractOnlyWord = (word: string) => word.split(' ')[0]

export const getRandomWordFromList = (d: Date) => {
    const allWords: Array<ShortWordType> = listAllWords()
    const random = getRandomNumberForToday(d, 0, allWords.length)
    const word = allWords[random].word
    return { word, w: extractOnlyWord(word) }
}
