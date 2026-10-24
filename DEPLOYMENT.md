# Netlify deployment

The Netlify CLI is installed locally as a development dependency. Use it through
the npm scripts so every developer and CI job uses the version pinned in
`package-lock.json`.

## First-time setup

```sh
npm ci
npm run netlify:login
npm run netlify:link
```

`netlify:link` connects this checkout to an existing Netlify site and creates a
local `.netlify` directory, which is ignored by Git.

## Local preview

```sh
npm run netlify:dev
```

The preview is available at `http://localhost:8888`.

## Deploy

Create a draft deploy URL:

```sh
npm run netlify:deploy
```

Deploy to the production URL:

```sh
npm run netlify:deploy:prod
```

Both deploy commands run the build configured in `netlify.toml` before upload.
For non-interactive CI, provide `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` as
secret environment variables.
