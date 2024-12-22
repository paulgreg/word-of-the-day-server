export const ALPHA_AND_DATE_ONLY = /[^a-zA-Z0-9-]/g

export const ALPHA_ONLY = /[^a-zA-Z]/g

export const removeDangerousCharacters = (word: string, allowedRegEx = ALPHA_ONLY): string => {
    // Normalize the word by removing accents and diacritics
    const normalizedWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // Remove any character that is not a letter (a-z or A-Z)
    const cleanedWord = normalizedWord.replace(allowedRegEx, '')

    return cleanedWord
}
