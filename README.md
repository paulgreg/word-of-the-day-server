# Word of the day - server

A simple app to pick a random word daily and translate it in a few languages using OpenAI API.

The purpose of that project is to serve a word each day and its translation for the [eink esp32 display device](https://github.com/paulgreg/esp32_word-of-the-day).

## Configuration

copy `.env.dist` to `.env` and set your OpenAI api key   then run : 

    npm run build
    npm run generateDb # to create sqlite db

    # if you used previous version, you can import JSON files in data/word directory into db
    npm run importLegacyJSON

## Sources

  - [5000 words list from Oxford](https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000)
  - [simple css](https://simplecss.org/)
  - [OpenAI API](https://platform.openai.com/)