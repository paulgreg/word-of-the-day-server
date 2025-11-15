import { convertDateToFR, getDateStr } from './date'

describe('date', () => {
    describe('getDateStr', () => {
        const d = new Date(1763224217125)
        test('return date', () => expect(getDateStr(d)).toEqual('2025-11-15'))
    })
    describe('convertDateToFR', () => {
        test('return converted date', () => expect(convertDateToFR('2025-11-15')).toEqual('15/11/2025'))
    })
})
