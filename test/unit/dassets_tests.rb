require 'assert'
require 'romo-av/dassets'

require 'dassets'

module Romo::Av::Dassets

  class UnitTests < Assert::Context
    desc "Romo::Av::Dassets"
    subject{ Romo::Av::Dassets }

    should "configure Romo::Av with Dassets" do
      subject.configure!

      source = Dassets.config.sources.detect do |source|
        source.path == Romo::Av.gem_assets_path.to_s
      end
      assert source

      exp_js_sources = [
        'js/romo-av/audio.js'
      ]
      assert_equal exp_js_sources, Dassets.config.combinations['js/romo-av-audio.js']

      exp_js_sources = [
        'js/romo-av/video.js',
        'js/romo-av/modal_video.js',
        'js/romo-av/dropdown_video.js'
      ]
      assert_equal exp_js_sources, Dassets.config.combinations['js/romo-av-video.js']

      exp_js_sources = [
        'js/romo-av-audio.js',
        'js/romo-av-video.js'
      ]
      assert_equal exp_js_sources, Dassets.config.combinations['js/romo-av.js']
    end

  end

end
