import {inputBinding, provideZonelessChangeDetection} from '@angular/core'
import {render, screen} from '@testing-library/angular'

import { TestBed } from '@angular/core/testing'
import { ZardDateComponent } from './date.component'



describe("Primitive Footer Tests", () => {
  let mockDate: Date
  let zFormat: string
  let actualDate: string
  const beginTest = async() => {
    await render(ZardDateComponent, {
      bindings: [inputBinding("value", () => mockDate), inputBinding("zFormat", () => zFormat)]
    })
    actualDate = screen.queryByRole("time")!.textContent
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    mockDate = new Date('2022-07-14T09:32:45.000Z')
  })

  describe("Experimenting with different zFormat should show the expected value", () => {
    it("English month and numeric year", async () => {
      zFormat = "MMMM yyyy"
      await beginTest()
      expect(actualDate).toBe("July 2022")
    })
    it("No format at all", async () => {
      zFormat = ""
      await beginTest()
      expect(actualDate).toBe("")
    })
  })
})