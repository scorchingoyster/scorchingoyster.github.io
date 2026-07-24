# frozen_string_literal: true

module BlogPagination
  class Page < Jekyll::PageWithoutAFile
    def initialize(site, source_page, page_number, posts, pagination)
      super(site, site.source, File.join('blog', 'page', page_number.to_s), 'index.html')

      self.content = source_page.content
      self.data = source_page.data.dup
      data.delete('permalink')
      data['paginator'] = pagination.merge('posts' => posts, 'page' => page_number)
    end
  end

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      source_page = site.pages.find { |page| page.data['paginate'] }
      return unless source_page

      per_page = Integer(source_page.data['paginate'])
      posts = site.posts.docs.sort_by(&:date).reverse
      total_pages = [(posts.length.to_f / per_page).ceil, 1].max

      source_page.data['paginator'] = pagination_data(1, total_pages, per_page).merge(
        'posts' => posts.first(per_page),
        'page' => 1
      )

      (2..total_pages).each do |page_number|
        offset = (page_number - 1) * per_page
        page_posts = posts.slice(offset, per_page) || []
        pagination = pagination_data(page_number, total_pages, per_page)
        site.pages << Page.new(site, source_page, page_number, page_posts, pagination)
      end
    end

    private

    def pagination_data(page_number, total_pages, per_page)
      {
        'per_page' => per_page,
        'total_pages' => total_pages,
        'previous_page_path' => previous_path(page_number),
        'next_page_path' => next_path(page_number, total_pages)
      }
    end

    def previous_path(page_number)
      return nil if page_number == 1
      return '/blog' if page_number == 2

      "/blog/page/#{page_number - 1}/"
    end

    def next_path(page_number, total_pages)
      return nil if page_number == total_pages

      "/blog/page/#{page_number + 1}/"
    end
  end
end
