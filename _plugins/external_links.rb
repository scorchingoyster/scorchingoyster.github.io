# frozen_string_literal: true

module ExternalLinks
  EXTERNAL_ANCHOR = /<a\b(?<attributes>[^>]*\bhref=(?<quote>["'])https?:\/\/.*?\k<quote>[^>]*)>/i
  TARGET_ATTRIBUTE = /\btarget\s*=\s*(["']).*?\1/i
  REL_ATTRIBUTE = /\brel\s*=\s*(["'])(.*?)\1/i
  REQUIRED_REL_VALUES = %w[noopener noreferrer].freeze

  def self.secure(html)
    html.gsub(EXTERNAL_ANCHOR) do |anchor|
      anchor = anchor.sub(/>\z/, ' target="_blank">') unless anchor.match?(TARGET_ATTRIBUTE)

      if anchor.match?(REL_ATTRIBUTE)
        anchor.sub(REL_ATTRIBUTE) do
          quote = Regexp.last_match(1)
          values = Regexp.last_match(2).split | REQUIRED_REL_VALUES
          %(rel=#{quote}#{values.join(' ')}#{quote})
        end
      else
        anchor.sub(/>\z/, ' rel="noopener noreferrer">')
      end
    end
  end
end

Jekyll::Hooks.register %i[pages documents], :post_render do |document|
  next unless document.output_ext == '.html'

  document.output = ExternalLinks.secure(document.output)
end
