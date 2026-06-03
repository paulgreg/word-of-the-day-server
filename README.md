# Word of the day - server

A simple app to pick a random word daily and translate it in a few languages using an LLM API.

The purpose of that project is to serve a word each day and its translation for the [eink esp32 display device](https://github.com/paulgreg/esp32_word-of-the-day).

Use `ROOT_URL` to define base URL.

## Scripts

- `npm run generateDb` : initialize the SQLite database 
- `npm run sync-translations` : translate words from `data/words.txt` and insert into database (requires `AI_GATEWAY_API_KEY` and `LLM_MODEL` env vars)
- `npm run sync-translations:dry-run` : won’t call LLM translations


## Sources

  - [5000 words list from Oxford](https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000)
  - [simple css](https://simplecss.org/)
  - [OpenAI API](https://platform.openai.com/)