import { convertToHexEscapedString, extractOnlyWord } from './words'
describe('words', () => {
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
