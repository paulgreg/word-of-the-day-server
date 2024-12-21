// reverso-api.d.ts
declare module 'reverso-api' {
    class Reverso {
        constructor()

        getContext(
            text: string, // Text to translate or analyze
            sourceLang: string, // Source language (e.g., 'english')
            targetLang: string // Target language (e.g., 'russian')
        ): Promise<ReversoResponse>
    }

    interface ReversoResponse {
        ok: boolean
        context: string // Example field, adapt this to the actual API response structure
        translations: string[] // Translated texts in an array
        examples: Array<{
            source: string // Example source sentence
            target: string // Example target sentence
        }>
    }

    export = Reverso
}
