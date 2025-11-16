import { convertToHexEscapedString, extractOnlyWord, getRandomWordFromList } from './words'
describe('words', () => {
    describe('getRandomWordFromList', () => {
        const yesterday = new Date(1763224217125)
        const today = new Date(1763286169028)

        test('should return yesterday’s word', () =>
            expect(getRandomWordFromList(yesterday)).toEqual({
                w: 'difficulty',
                word: 'difficulty n.',
            }))

        test('should return today’s word', () =>
            expect(getRandomWordFromList(today)).toEqual({
                w: 'imply',
                word: 'imply v.',
            }))
    })

    describe('extractOnlyWord', () => {
        test('should return remove', () => expect(extractOnlyWord('remove v.')).toEqual('remove'))
        test('should return representative', () =>
            expect(extractOnlyWord('representative n., adj.')).toEqual('representative'))
        test('should return another det./pron.', () => expect(extractOnlyWord('another det./pron.')).toEqual('another'))
    })
    describe('convertToHexEscapedString', () => {
        test('should convert accent', () => expect(convertToHexEscapedString('ébène')).toEqual('\\xe9b\\xe8ne'))
        test('should convert ñ', () => expect(convertToHexEscapedString('añadir')).toEqual('a\\xf1adir'))
    })
})
