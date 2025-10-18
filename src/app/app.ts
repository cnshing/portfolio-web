import { Component } from '@angular/core';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [ZardButtonComponent, ZardAvatarComponent, ZardDividerComponent]
})
export class App {}