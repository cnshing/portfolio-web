import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import LandingAboutMeProfileComponent from '@features/landing/about-me/landing-about-me-profile';

@Component({
  selector: 'landing-about-me',
  standalone: true,
  imports: [LandingAboutMeProfileComponent],
  template: `
    <section class="grid">
      <div class="">
        <h2>
          Hi, my name is
          <br />
          <span class="text-color-accent">{{ name }}</span
          >.<span class="text-color-accent"> 👋</span>
        </h2>
        <br />
        <br />
        <p>
          I’m a developer that finds all aspects of software development fascinating. It’s why I
          spent a disproportionate amount of time towards web design simply because I was horrendous
          at it.
        </p>
        <br />
        <br />
        <p>
          My previous position had me contribute not only as a software engineer but also as a
          <span class="text-color-accent">leader</span>. From technical decision-making to
          <span class="text-color-accent">Agile processes</span>, I did what I thought would help
          the team feel confident to do their best.
        </p>
        <br />
        <br />
        <p>You can read more about my career in the next section.</p>
      </div>

      <landing-about-me-profile class="mx-auto" />
    </section>
  `,
  styles: `
  .grid
    grid-template-columns: repeat(auto-fit, minmax(min(var(--spacing-line-length), 100%), 1fr));
    align-content: center
    justify-content: center
  `,
})
export default class LandingAboutMeComponent {
  protected readonly name = environment.name;
}
