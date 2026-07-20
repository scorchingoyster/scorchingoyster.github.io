# Hongyi Dong's portfolio

This site is built with Jekyll. Ruby and gem versions are pinned in
`.ruby-version` and `Gemfile.lock` so local and production builds are
reproducible.

## Prerequisites

- Homebrew
- rbenv and ruby-build

Install and initialise rbenv on macOS:

```sh
brew install rbenv ruby-build
rbenv init
```

Follow the printed instruction to initialise rbenv in your shell, then restart
the shell. From this repository, install the pinned Ruby and dependencies:

```sh
rbenv install -s "$(cat .ruby-version)"
gem install bundler -v "$(awk '/BUNDLED WITH/{getline; gsub(/^[[:space:]]+/, ""); print}' Gemfile.lock)"
bundle install
```

Do not use `sudo gem install`; rbenv keeps project gems separate from macOS's
system Ruby.

## Development

Start the local server with live reload:

```sh
bundle exec jekyll serve --livereload
```

The site is available at <http://127.0.0.1:4000>.

Build the production site into `_site/`:

```sh
JEKYLL_ENV=production bundle exec jekyll build
```

When changing dependencies, edit `Gemfile` and use `bundle update GEM_NAME` for
a targeted update. Commit both `Gemfile` and `Gemfile.lock`.
