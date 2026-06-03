import { getRandomNumberForToday } from './math'

describe('math', () => {
    const yesterday = new Date(1763224217125)
    const today = new Date(1763286169028)

    describe('getRandomNumberForToday', () => {
        test('should return a number within the specified range', () => {
            const num = getRandomNumberForToday(today, 0, 10)
            expect(num).toBeGreaterThanOrEqual(0)
            expect(num).toBeLessThanOrEqual(10)
        })

        test('should return same number for same date (deterministic)', () => {
            const num1 = getRandomNumberForToday(today, 0, 100)
            const num2 = getRandomNumberForToday(today, 0, 100)
            expect(num1).toBe(num2)
        })

        test('should return different number for different dates', () => {
            const numY = getRandomNumberForToday(yesterday, 0, 100)
            const numT = getRandomNumberForToday(today, 0, 100)
            expect(numY).not.toBe(numT)
        })

        test('should handle range where min equals max', () => {
            const num = getRandomNumberForToday(today, 5, 5)
            expect(num).toBe(5)
        })

        test('should return a value within range when min and max differ', () => {
            const num = getRandomNumberForToday(today, 0, 1)
            expect(num).toBeGreaterThanOrEqual(0)
            expect(num).toBeLessThanOrEqual(1)
        })
    })
})
