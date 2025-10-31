import {inputBinding, provideZonelessChangeDetection} from '@angular/core'
import {render, screen,} from '@testing-library/angular'
import { FooterComponent } from './footer.component'
import { TestBed } from '@angular/core/testing'
describe("Primitive Footer Tests", () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
  })
  it("When given a zHeight, the styled height should be identical in rem", async () => {
    const zHeight = 7
    await render(FooterComponent, {
      bindings: [inputBinding('zHeight', () => zHeight)]
    })
    const footer = screen.getByRole('contentinfo')
    const actualHeight = parseInt(footer.style.height)
    expect(actualHeight).toBe(zHeight)
  })
})


