# frozen_string_literal: true

module CarbonEstimate
  BUILD_POWER_WATTS = 50.0
  GRID_INTENSITY_GCO2E_PER_KWH = 442.0
  DATA_ENERGY_KWH_PER_GB = 0.114
  BYTES_PER_GB = 1_000_000_000.0
  TOKENS = {
    '%%CARBON_BUILD_GRAMS%%' => :build_grams,
    '%%CARBON_BUILD_SECONDS%%' => :build_seconds,
    '%%CARBON_SITE_SIZE%%' => :site_size,
    '%%CARBON_PAGE_GRAMS%%' => :page_grams,
    '%%CARBON_PAGE_KB%%' => :page_kb,
    '%%CARBON_THOUSAND_VIEWS_GRAMS%%' => :thousand_views_grams,
    '%%CARBON_UPDATED_AT%%' => :updated_at
  }.freeze

  class << self
    attr_accessor :started_at

    def files_in(path)
      Dir.glob(File.join(path, '**', '*')).select { |file| File.file?(file) }
    end

    def direct_page_bytes(site, html)
      bytes = File.size(html)
      markup = File.read(html)

      markup.scan(/(?:href|src)=["']([^"']+)["']/i).flatten.uniq.each do |url|
        next if url.match?(%r{\A(?:https?:)?//})

        relative_path = url.split(/[?#]/, 2).first.sub(%r{\A/}, '')
        asset = File.join(site.dest, relative_path)
        bytes += File.size(asset) if File.file?(asset)
      end

      bytes
    end

    def readable_bytes(bytes)
      bytes >= 1_000_000 ? format('%.1f MB', bytes / 1_000_000.0) : format('%.0f KB', bytes / 1_000.0)
    end

    def readable_grams(grams)
      return '&lt; 0.001 g CO₂e' if grams < 0.001

      format('%.3f g CO₂e', grams)
    end
  end
end

Jekyll::Hooks.register :site, :after_init do
  CarbonEstimate.started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)
end

Jekyll::Hooks.register :site, :post_write do |site|
  page = File.join(site.dest, '404.html')
  next unless File.file?(page)

  duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - CarbonEstimate.started_at
  site_bytes = CarbonEstimate.files_in(site.dest).sum { |file| File.size(file) }
  page_bytes = CarbonEstimate.direct_page_bytes(site, page)
  build_kwh = (CarbonEstimate::BUILD_POWER_WATTS / 1000.0) * (duration / 3600.0)
  build_grams = build_kwh * CarbonEstimate::GRID_INTENSITY_GCO2E_PER_KWH
  page_grams = (page_bytes / CarbonEstimate::BYTES_PER_GB) *
               CarbonEstimate::DATA_ENERGY_KWH_PER_GB *
               CarbonEstimate::GRID_INTENSITY_GCO2E_PER_KWH

  values = {
    build_grams: CarbonEstimate.readable_grams(build_grams),
    build_seconds: format('%.2f seconds', duration),
    site_size: CarbonEstimate.readable_bytes(site_bytes),
    page_grams: CarbonEstimate.readable_grams(page_grams),
    page_kb: CarbonEstimate.readable_bytes(page_bytes),
    thousand_views_grams: CarbonEstimate.readable_grams(page_grams * 1000),
    updated_at: Time.now.utc.strftime('%-d %B %Y at %H:%M UTC')
  }

  output = File.read(page)
  CarbonEstimate::TOKENS.each { |token, key| output.gsub!(token, values.fetch(key)) }
  File.write(page, output)
end
