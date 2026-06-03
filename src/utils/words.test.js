import { extractOnlyWord, getRandomWordFromList } from './words'

describe('words', () => {
    const today = new Date(1763286169028)
    describe('getRandomWordFromList', () => {
        test('should return an object with word and w properties', () => {
            const result = getRandomWordFromList(today)
            expect(result).toHaveProperty('word')
            expect(result).toHaveProperty('w')
            expect(typeof result.word).toBe('string')
            expect(typeof result.w).toBe('string')
        })

        test('should return word from available words list', () => {
            const result = getRandomWordFromList(today)
            expect(result.word.length).toBeGreaterThan(0)
        })
    })

    describe('extractOnlyWord', () => {
        test('should return remove', () => expect(extractOnlyWord('remove v.')).toEqual('remove'))
        test('should return representative', () =>
            expect(extractOnlyWord('representative n., adj.')).toEqual('representative'))
        test('should return another det./pron.', () => expect(extractOnlyWord('another det./pron.')).toEqual('another'))
    })
})
