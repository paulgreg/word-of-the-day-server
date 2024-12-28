import { writeResult } from './write'
import { getRandomWordFromList } from './words'
import OpenAI from 'openai'

const { word, w } = getRandomWordFromList()

console.info(`Word: ${word} - ${w}`)

try {
    const openai = new OpenAI()
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        store: true,
        messages: [
            {
                role: 'developer',
                content:
                    'You are a translator that translate a word of the day in different languages in that order : French, Spanish, Italian and Portuguese. You should only respond with one answer per language per line, without explanation. All translations should have the same meaning.',
            },
            {
                role: 'user',
                content: `translate: ${w}`,
            },
        ],
    })

    if (completion.choices.length === 0) throw new Error('no result')
    const answer = completion.choices[0]
    if (!answer?.message?.content) throw new Error('No answer')

    const words = answer.message.content.split('\n').map((w) => w.trim())
    console.info(`Answer:`, words)

    if (words.length != 4) throw new Error('No 4 answers')

    await writeResult(word, w, [
        { lang: 'fr', word: words[0] },
        { lang: 'es', word: words[1] },
        { lang: 'it', word: words[2] },
        { lang: 'pt', word: words[3] },
    ])
} catch (e) {
    console.error(e)
    process.exit(1)
}
