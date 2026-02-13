import { Component, provideZonelessChangeDetection, signal } from "@angular/core"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser"

const tokens = ["--color-brand",
  "--color-brand-subtle",

  /* Foreground */
  "--text-color-default",
  "--text-color-accent",
  "--text-color-secondary",
  "--text-color-tertiary",

  /* Background */
  "--bg-color-surface1",
  "--bg-color-surface2",
  "--bg-color-page",
  "--bg-color-page-gradient",
  "--bg-color-button",

  /* Border */
  "--border-color-default",
  "--border-color-strong",
  "--border-color-button",
  "--border-color-company-icon",
  "--border-color-subtle",
  "--border-color-medium",

  /* On Background */
  "--on-bg-color-default",
  "--on-bg-color-secondary",
  "--on-bg-color-tertiary",
  "--on-bg-color-accent",
  "--on-bg-color-button"]
/**
 * Dynamically retrieves any themes defined as a `data-theme`
 * selector attribute.
 *
 * @returns {string[]}
 */
function retrieveDataThemes(): string[] {
  const themes: Set<string> = new Set()
  const Exp = /data-theme=["'](.+)["']/gm
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      if ('cssText' in rule) {
        const css = rule.cssText
        for (const match of css.matchAll(Exp)) {
          const theme = match[1]!
          themes.add(theme)
        }
      }
    }
  }
  return Array.from(themes)
}


/**
 * Special component used to support data-theme queries.
 *
 * @class DummyTheme
 * @typedef {DummyTheme}
 */
@Component({
  template: `
    <div [attr.data-theme]="theme()"></div>
  `
})
class DummyTheme {
  theme = signal<string>("");
}

interface TestCaseData {
  theme: string
  token: string
}
describe("Ensuring consistency with design system coloring", () => {
  let themes = retrieveDataThemes()
  let themeFixture: ComponentFixture<DummyTheme>
  let dummyTheme: DummyTheme
  let div: HTMLElement

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    themeFixture = TestBed.createComponent(DummyTheme)
    dummyTheme = themeFixture.componentInstance
    await themeFixture.whenRenderingDone()
    div = themeFixture.debugElement.query(By.css('[data-theme]')).nativeElement
  })

  const tokenThemes: TestCaseData[] = []

  for (const theme of themes) {
    for (const token of tokens) {
      tokenThemes.push({ theme, token })
    }
  }

  test.each(tokenThemes)(
    "$theme's theme should have $token defined",
    async ({ theme, token }) => {
      dummyTheme.theme.set(theme)
      await themeFixture.whenStable()
      const styles = window.getComputedStyle(div!)
      const tokenProperty = styles.getPropertyValue(token)
      expect(tokenProperty).not.toBe("")
    }
  )
})

