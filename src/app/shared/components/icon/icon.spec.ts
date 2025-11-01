import {inputBinding, Provider, provideZonelessChangeDetection} from '@angular/core'
import {render, screen} from '@testing-library/angular'
import { ZardIconComponent } from './icon.component'
import { TestBed } from '@angular/core/testing'
import { provideNgIconLoader } from '@ng-icons/core'


describe("Primitive Icon Tests", () => {
  let mockIcon: string
  let svg: Element
  /**
   * Run this function to initialize the data and make `svg` accessible.
   *
   * @async
   * @param {Provider[]} mockProviders Any providers to handle mock data
   * @returns {*}
   */
  const start = async (mockProviders: Provider[]) => {
    await render(
      ZardIconComponent, {
        bindings: [inputBinding("zType", () => "")],
        componentProviders: mockProviders
      })
    svg = screen.getByRole("img", {hidden: true}).firstElementChild!
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    mockIcon = '<svg><circle></circle></svg>'
  })

  describe("When provided with their own SVG data and mock icons, the underlying svg element in the DOM should be the same as the SVG data", () => {
    it("For dynamic lazy icons", async () => {
      await start(provideNgIconLoader(_=>mockIcon))
      expect(svg.outerHTML).toBe(mockIcon)
    })
  })
})