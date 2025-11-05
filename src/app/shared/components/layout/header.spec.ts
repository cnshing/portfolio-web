import {inputBinding, provideZonelessChangeDetection} from '@angular/core'
import {render, screen,} from '@testing-library/angular'
import { HeaderComponent } from './header.component'
import { TestBed } from '@angular/core/testing'
describe("Primitive Header Tests", () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
  })
  it("When given a zHeight, the styled height should be identical in rem", async () => {
    const zHeight = 150
    await render(HeaderComponent, {
      bindings: [inputBinding('zHeight', () => zHeight)]
    })
    const footer = screen.getByRole('banner')
    const actualHeight = parseInt(footer.style.height)
    expect(actualHeight).toBe(zHeight)
  })
})


