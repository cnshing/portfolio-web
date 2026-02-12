import { IMAGE_LOADER } from '@angular/common';
import { pixelDensityImageLoader, IMAGE_LOADER_PROVIDER } from './image-loader.provider';

describe('pixelDensityImageLoader', () => {

  describe('with valid config', () => {
    it('should return correct path for exact density match', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 1000,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should select best density when requested width is between densities', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 600,
        loaderParams: { baseWidth: 1000 }
      });

      // 600px is closest to 0.5 density (500px) rather than 0.75 (750px)
      expect(result).toBe('/assets/image@0.5x.avif');
    });

    it('should select 0.75 density for width 700 with baseWidth 1000', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 700,
        loaderParams: { baseWidth: 1000 }
      });

      // 700px is closest to 0.75 density (750px)
      expect(result).toBe('/assets/image@0.75x.avif');
    });

    it('should select smallest density (0.125) for very small widths', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 100,
        loaderParams: { baseWidth: 1000 }
      });

      // 100px is closest to 0.125 density (125px)
      expect(result).toBe('/assets/image@0.125x.avif');
    });

    it('should select 0.25 density for width 250', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 250,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@0.25x.avif');
    });

    it('should handle different base widths correctly', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 400,
        loaderParams: { baseWidth: 800 }
      });

      // 400px with baseWidth 800 = 0.5 density
      expect(result).toBe('/assets/image@0.5x.avif');
    });

    it('should convert file extension to .avif', () => {
      const result = pixelDensityImageLoader({
        src: 'path/to/image.jpg',
        width: 1000,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('path/to/image@1x.avif');
    });

    it('should handle paths with multiple dots', () => {
      const result = pixelDensityImageLoader({
        src: 'path/to/my.image.file.png',
        width: 500,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('path/to/my.image.file@0.5x.avif');
    });

    it('should handle paths without directories', () => {
      const result = pixelDensityImageLoader({
        src: 'image.png',
        width: 750,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('image@0.75x.avif');
    });
  });

  describe('fallback behavior', () => {
    it('should fallback to 1x density when width is missing', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should fallback to 1x density when width is 0', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 0,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should fallback to 1x density when loaderParams is missing', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 800
      });

      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should fallback to 1x density when baseWidth is missing from loaderParams', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 800,
        loaderParams: {}
      });

      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should fallback to 1x density when both width and loaderParams are missing', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png'
      });

      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should fallback to 1x density when loaderParams is null', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 800,
        loaderParams: null as any
      });

      expect(result).toBe('/assets/image@1x.avif');
    });
  });

  describe('edge cases', () => {
    it('should handle very large width values', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 10000,
        loaderParams: { baseWidth: 1000 }
      });

      // Should select maximum density (1.0)
      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should handle width equal to 1', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 1,
        loaderParams: { baseWidth: 1000 }
      });

      // 1px is closest to 0.125 density (125px)
      expect(result).toBe('/assets/image@0.125x.avif');
    });

    it('should handle baseWidth of 1', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 1,
        loaderParams: { baseWidth: 1 }
      });

      // 1px with baseWidth 1 = 1.0 density
      expect(result).toBe('/assets/image@1x.avif');
    });

    it('should handle paths with no extension', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image',
        width: 500,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@0.5x.avif');
    });

    it('should handle paths with special characters', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/my-image_v2.png',
        width: 250,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/my-image_v2@0.25x.avif');
    });

    it('should select appropriate density when width equals a density threshold', () => {
      // 125px = exactly 0.125 density for baseWidth 1000
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 125,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@0.125x.avif');
    });

    it('should handle fractional widths', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 625.5,
        loaderParams: { baseWidth: 1000 }
      });

      // 625.5px is closest to 0.5 density (500px) or 0.75 (750px)
      // 625.5 - 500 = 125.5, 750 - 625.5 = 124.5, so 0.75 is closer
      expect(result).toBe('/assets/image@0.75x.avif');
    });
  });

  describe('all available densities', () => {
    it('should be able to select 0.125x density', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 125,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@0.125x.avif');
    });

    it('should be able to select 0.25x density', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 250,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@0.25x.avif');
    });

    it('should be able to select 0.5x density', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 500,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@0.5x.avif');
    });

    it('should be able to select 0.75x density', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 750,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@0.75x.avif');
    });

    it('should be able to select 1x density', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 1000,
        loaderParams: { baseWidth: 1000 }
      });

      expect(result).toBe('/assets/image@1x.avif');
    });
  });

  describe('fallbackOffset parameter', () => {
    it('should step down by 1 when fallbackOffset is 1', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 1000,
        loaderParams: { baseWidth: 1000 }
      }, 1);

      // Best density is 1.0 (index 4), step down by 1 -> 0.75 (index 3)
      expect(result).toBe('/assets/image@0.75x.avif');
    });

    it('should step down by 2 when fallbackOffset is 2', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 750,
        loaderParams: { baseWidth: 1000 }
      }, 2);

      // Best density is 0.75 (index 3), step down by 2 -> 0.25 (index 1)
      expect(result).toBe('/assets/image@0.25x.avif');
    });

    it('should not step below minimum density when fallbackOffset is large', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 250,
        loaderParams: { baseWidth: 1000 }
      }, 999);

      // Best density is 0.25 (index 1), step down by 5 would be negative, should use 0.125 (index 0)
      expect(result).toBe('/assets/image@0.125x.avif');
    });

    it('should prefer stepDownOffset from loaderParams over fallbackOffset', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 1000,
        loaderParams: { baseWidth: 1000, stepDownOffset: 2 }
      }, 1);

      // Best density is 1.0 (index 4), stepDownOffset of 2 should override fallbackOffset of 1
      // Step down by 2 -> 0.5 (index 2)
      expect(result).toBe('/assets/image@0.5x.avif');
    });

    it('should use stepDownOffset of 0 from loaderParams even when fallbackOffset is provided', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 500,
        loaderParams: { baseWidth: 1000, stepDownOffset: 0 }
      }, 2);

      // Best density is 0.5, stepDownOffset of 0 should override fallbackOffset of 2
      expect(result).toBe('/assets/image@0.5x.avif');
    });

    it('should handle fallbackOffset with small densities', () => {
      const result = pixelDensityImageLoader({
        src: '/assets/image.png',
        width: 125,
        loaderParams: { baseWidth: 1000 }
      }, 1);

      // Best density is 0.125 (index 0), step down by 1 would be negative, should stay at 0.125
      expect(result).toBe('/assets/image@0.125x.avif');
    });
  });
});

describe('IMAGE_LOADER_PROVIDER', () => {
  it('should provide IMAGE_LOADER token', () => {
    expect(IMAGE_LOADER_PROVIDER.provide).toBe(IMAGE_LOADER);
  });

  it('should use pixelDensityImageLoader as the value', () => {
    expect(IMAGE_LOADER_PROVIDER.useValue).toBe(pixelDensityImageLoader);
  });
});
