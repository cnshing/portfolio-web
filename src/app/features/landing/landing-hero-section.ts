import { Component } from "@angular/core";
import { environment } from "@environments/environment";
import { ZardButtonComponent } from "@shared/components/button/button.component";
import { ZardIconComponent } from "@shared/components/icon/icon.component";

@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [ZardButtonComponent, ZardIconComponent],
  template: `
  <section class="relative bg-color-page flex flex-wrap justify-content">
    <div class="flex flex-col gap-lg py-2xl pl-3xl max-w-[50vw] z-1">
      <div>
      <h1 class="text-hero-accent">Zooming</h1>
      <h1 class="inline-block">Full Stack Developer</h1>
      </div>
      <p class="text-xl"><span class="text-color-accent">{{ name }}</span> here — a software engineer experienced in frontend and middleware development for ROS (Robot Operating System).</p>
      <button z-button class="w-min">
        <i z-icon zSize="lg" zType="resume"></i>
        View Resume
      </button>
    </div>
    <video autoplay loop class="absolute right-0 bottom-0 w-[75vw] h-full py-2xl">
      <source src="assets/videos/motorcycle.mp4" type="video/mp4">
    </video>
  </section>
  `
})
export default class LandingHeroComponent {
  protected readonly name = environment.name
}