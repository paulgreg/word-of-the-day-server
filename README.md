# Word of the day - server

An API to get a random word and translation in a few languages. It uses ChatGPT for translations.

The purpose of that project is to serve the word of the day for the [eink esp32 display device](https://github.com/paulgreg/esp32_word-of-the-day).

## Generate word daily

   npm run build && OPENAI_API_KEY="your-key" npm run generate-word-of-the-day

## Sources

  - [5000 words list from Oxford](https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000)
  - [simple css](https://simplecss.org/)