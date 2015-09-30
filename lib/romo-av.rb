require 'romo'
require "romo-av/version"

module Romo::Av

  def self.gem_assets_path; self.gem_path.join('assets'); end

  private

  def self.gem_path
    @gem_path ||= Pathname(Gem.loaded_specs['romo-av'].full_gem_path)
  end

end
