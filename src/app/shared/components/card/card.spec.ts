import { Component, input, inputBinding, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ZardCardComponent } from "./card.component";
import { render, screen } from "@testing-library/angular";



/**
 * A test component for `ZardCardComponent` as a temporary workaround to use template references.
 *
 * @class TestZardCardComponent
 * @typedef {TestZardCardComponent}
 */
@Component({
  template: `
    <ng-template #zAvatar>
      <img />
    </ng-template>

    <ng-template #zIcon>
      <svg role="img" aria-hidden="true"><rect /></svg>
    </ng-template>

    <ng-template #zLabel>
      <time datetime='2022-07-14T09:32:45.000Z'>2022-07-14T09:32:45.000Z</time>
    </ng-template>

    <z-card [zTitle]="zTitle()" [zDescription]="zDescription()" [zAvatarOrIcon]="zAvatarOrIcon() === 'zAvatar' ? zAvatar : zIcon" [zLabel]="zLabel"></z-card>
  `,
  standalone: true,
  imports: [ZardCardComponent],
})
class TestZardCardComponent {
  /**
   * Whether to use zAvatar or zIcon for this instance.
   *
   * @type {*}
   */
  zAvatarOrIcon = input<"zAvatar" | "zIcon">("zAvatar")
  /**
   * Test dummy title.
   *
   * @type {*}
   */
  zTitle = input<string>("")
  /**
   * Test dummy description.
   *
   * @type {*}
   */
  zDescription = input<string>("")
}

describe("Primitive Card Tests", () => {
  const zTitle = "Test Title"
  const zDescription = "Test Description"


  /**
   * Retrieves all testing elements used.
   *
   * @returns {{ title: any; description: any; avatar: any; icon: any; label: any; }}
   */
  const getTestingEls = () => ({
    title: screen.queryByText(zTitle),
    description: screen.queryByText(zDescription),
    avatar: screen.queryByRole("img"),
    icon: screen.queryByRole("img", { hidden: true }),
    label: screen.queryByRole("time"),
  })

  /**
   * Creates a `TestZardCardComponent` for testing.
   *
   * @async
   * @param {?("zAvatar" | "zIcon")} [zAvatarOrIcon] Should `zAvatar` or `zIcon` be tested?
   * @returns {*}
   */
  const renderCard = async (
    zAvatarOrIcon?: "zAvatar" | "zIcon"
  ) => {
    await render(TestZardCardComponent, {
      bindings: [
        inputBinding("zAvatarOrIcon", () => zAvatarOrIcon),
        inputBinding("zTitle", () => zTitle),
        inputBinding("zDescription", () => zDescription),
      ],
    });
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    })
  })

  describe("When a zTitle or zDescription is provided", () => {
    it("zTitle should render", async () => {
      await renderCard()
      const { title } = getTestingEls()
      expect(title).toBeDefined()
    })
    it("zDescription should render", async() => {
      await renderCard()
      const { description } = getTestingEls()
      expect(description).toBeDefined()
    })
    it("zTitle and zDescription should be siblings", async () => {
      await renderCard()
      const {title, description} = getTestingEls()
      expect(title!.parentElement).toBe(description!.parentElement)
    })
  })
  describe("When a zAvatar is provided", () => {
    it("Sanity check should render avatar", async () => {
      await renderCard("zAvatar")
      const { avatar } = getTestingEls()
      expect(avatar).toBeDefined()
    })
    it("zAvatar should be a sibling of zTitle and zDescription's parents", async () => {
      await renderCard("zAvatar")
      const { title, avatar } = getTestingEls()
      expect(avatar!.parentElement).toBe(title!.parentElement!.parentElement)
    })
  })

  describe("When a zIcon is provided", () => {
    it("Sanity check should render icon", async () => {
      await renderCard("zIcon")
      const { icon } = getTestingEls()
      expect(icon).not.toBeNull()
    })
    it("zAvatar should be a sibling of zTitle and zDescription's parents", async () => {
      await renderCard("zIcon")
      const { title, icon } = getTestingEls()
      expect(icon!.parentElement).toBe(title!.parentElement!.parentElement)
    })
  })


  describe("When a zLabel is provided", () => {
    it("should render label", async () => {
      await renderCard()
      const { label } = getTestingEls()
      expect(label).not.toBeNull()
    })
    it("zLabel should be the last sibling of zTitle and zDescription's parents", async () => {
      await renderCard()
      const { label, title } = getTestingEls()
      expect (label!.parentElement).toBe(title!.parentElement!.parentElement)
      expect(label!.parentElement!.lastElementChild).toBe(label)
    })
  })
})