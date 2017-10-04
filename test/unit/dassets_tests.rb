require 'assert'
require 'romo-av/dassets'

require 'dassets'

module Romo::Av::Dassets

  class UnitTests < Assert::Context
    desc "Romo::Av::Dassets"
    setup do
      Romo::Av::Dassets.reset!
    end
    teardown do
      Romo::Av::Dassets.reset!
    end
    subject{ Romo::Av::Dassets }

    should have_imeths :configure!, :reset!

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

    should "only configure itself once unless reset" do
      subject.configure!

      dassets_call_count = 0
      Assert.stub(::Dassets, :configure){ dassets_call_count += 1 }

      assert_equal 0, dassets_call_count
      subject.configure!
      assert_equal 0, dassets_call_count

      subject.reset!

      assert_equal 0, dassets_call_count
      subject.configure!
      assert_equal 1, dassets_call_count
    end

  end

end
