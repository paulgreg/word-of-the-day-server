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
