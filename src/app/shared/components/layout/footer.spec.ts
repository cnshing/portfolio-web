import {inputBinding, provideZonelessChangeDetection} from '@angular/core'
import {render, screen,} from '@testing-library/angular'
import { FooterComponent } from './footer.component'
import { TestBed } from '@angular/core/testing'
import { ComponentType } from '@angular/cdk/overlay';
describe("Primitive Footer Tests", () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
  })
  it("When given a zHeight, the styled height should be identical in rem", async () => {
    testHeight(FooterComponent, 9)
  })
})


export const testHeight = async<T>(component: ComponentType<T>, zHeight:number) => {
  async () => {
    await render(component, {
      bindings: [inputBinding('zHeight', () => zHeight)]
    })
    const footer = screen.getByRole('contentinfo')
    const actualHeight = parseInt(footer.style.height)
    expect(actualHeight).toBe(zHeight)
  }
}