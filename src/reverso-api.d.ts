// reverso-api.d.ts
interface ReversoResponse {
    ok: boolean
    text: string
    source: string
    target: string
    translations: string[]
    examples: Array<{
        source: string
        target: string
    }>
}

declare module 'reverso-api' {
    class Reverso {
        constructor()

        getContext(
            text: string, // Text to translate or analyze
            sourceLang: string, // Source language (e.g., 'english')
            targetLang: string // Target language (e.g., 'russian')
        ): Promise<ReversoResponse>
    }

    export = Reverso
}
