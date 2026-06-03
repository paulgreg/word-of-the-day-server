export const getRandomNumberForToday = (d: Date, min: number, max: number) => {
    const firstDay = new Date(2025, 0, 0)
    const dayOfYear = Math.floor((d.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24))
    const seed = dayOfYear

    // Generate a random number based on the seed and the provided range
    const random = Math.sin(seed) * 10000
    const boundedRandom = Math.floor((random - Math.floor(random)) * (max - min + 1)) + min

    return boundedRandom
}
