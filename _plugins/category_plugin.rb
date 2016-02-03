module Jekyll

  class CategoryPage < Page
    def initialize(site, base, dir, category)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category_index.html')
      self.data['category'] = category

      category_title_prefix = site.config['category_title_prefix'] || 'Category: '
      self.data['title'] = "#{category_title_prefix}#{category}"
    end
  end

  class CategoryCountPage < Page
    def initialize(site, base, dir, categorycount)
      @site = site
      @base = base
      @dir = dir
      @name = 'categorycount.json'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category_count.html')
      self.data['categorycount'] = categorycount
    end
  end

  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category_index'
        dir = site.config['category_dir'] || 'categories'
        site.categories.keys.each do |category|
          site.pages << CategoryPage.new(site, site.source, File.join(dir, category.downcase), category)
        end
      end
      if site.layouts.key? 'category_count'
        dir = '/'
        hash = Hash.new { |hash, key| hash[key] = [ key, 0] }

        site.categories.keys.each do |category|
          hash[category.downcase][0] = category
          hash[category.downcase][1] += site.categories[category].length
        end

        site.pages << CategoryCountPage.new(site, site.source, File.join(dir), hash)
      end
    end
  end

end
