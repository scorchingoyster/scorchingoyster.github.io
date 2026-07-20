# frozen_string_literal: true

module SmartPunctuation
  SKIPPED_ELEMENTS = %w[code kbd pre samp script style textarea].freeze
  TAG = /<!--.*?-->|<![^>]*>|<[^>]+>/m

  def self.transform_text(text)
    text
      .gsub(/(^|[\s\(\[\{—–])"(?=\S)/, '\1“')
      .gsub('"', '”')
      .gsub(/(?<![[:alnum:]])'(?=\d{2}s\b)/, '’')
      .gsub(/(?<=[[:alnum:]])'/, '’')
      .gsub(/(^|[\s\(\[\{—–])'(?=\S)/, '\1‘')
      .gsub("'", '’')
  end

  def self.transform(html)
    output = +''
    position = 0
    skipped = []

    html.to_enum(:scan, TAG).each do
      match = Regexp.last_match
      text = html[position...match.begin(0)]
      output << (skipped.empty? ? transform_text(text) : text)

      tag = match[0]
      output << tag

      if (closing = tag.match(%r{\A</\s*([a-z0-9:-]+)}i))
        skipped.pop if skipped.last == closing[1].downcase
      elsif (opening = tag.match(/\A<\s*([a-z0-9:-]+)/i))
        name = opening[1].downcase
        skipped << name if SKIPPED_ELEMENTS.include?(name) && !tag.end_with?('/>')
      end

      position = match.end(0)
    end

    remainder = html[position..]
    output << (skipped.empty? ? transform_text(remainder) : remainder)
    output
  end
end

Jekyll::Hooks.register %i[pages documents], :post_render do |document|
  next unless document.output_ext == '.html'

  document.output = SmartPunctuation.transform(document.output)
end
