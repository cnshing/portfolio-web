import { Component, input } from "@angular/core";
import { NgClass } from "@angular/common";


@Component({
  selector: 'landing-transition',
  standalone: true,
  imports: [NgClass],
  templateUrl: './landing-transition-section.html',
  styleUrl: './landing-transition-section.sass'
})
export default class LandingTransitionComponent {
  readonly direction = input.required<"left"|"right">()
}