source "https://rubygems.org"

# Keep Jekyll on the latest compatible 4.x release. Always invoke it through
# Bundler so local commands and deployments use the versions in Gemfile.lock.
gem "jekyll", "~> 4.4.1"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1.2"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# These libraries are no longer guaranteed to ship as Ruby default gems.
gem "logger"
gem "bigdecimal"
