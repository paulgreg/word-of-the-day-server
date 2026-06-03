import { convertToHexEscapedString } from './string'
describe('words', () => {
    describe('convertToHexEscapedString', () => {
        test('should convert accent', () => expect(convertToHexEscapedString('ébène')).toEqual('\\xe9b\\xe8ne'))
        test('should convert ñ', () => expect(convertToHexEscapedString('añadir')).toEqual('a\\xf1adir'))
    })
})
