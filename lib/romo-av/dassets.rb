require 'dassets'
require 'romo-av'

module Romo::Av; end
module Romo::Av::Dassets

  # This assumes you are using 'js/romo-{audio|video}.js' as part of a larger
  # combination or are loading romo's modal/dropdown js components before
  # loading this combination.

  def self.configure!
    Dassets.configure do |c|
      c.source Romo::Av.gem_assets_path do |s|
        s.filter{ |paths| paths.reject{ |p| File.basename(p) =~ /^_/ } }
      end

      # just audio
      c.combination "js/romo-av-audio.js", [
        'js/romo-av/audio.js'
      ]

      # just video
      c.combination "js/romo-av-video.js", [
        'js/romo-av/video.js',
        'js/romo-av/modal_video.js',
        'js/romo-av/dropdown_video.js'
      ]

      # both audio and video
      c.combination "js/romo-av.js", [
        'js/romo-av-audio.js',
        'js/romo-av-video.js'
      ]

    end
  end

end
