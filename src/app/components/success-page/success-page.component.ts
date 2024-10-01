import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FaDuotoneIconComponent,
  FaIconComponent,
} from '@fortawesome/angular-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-duotone-svg-icons';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [FaIconComponent, FaDuotoneIconComponent],
  templateUrl: './success-page.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPageComponent {
  faBadgeCheck = faBadgeCheck;

  viewPayment() {
    window.open(environment.redirectUrl);
  }
}
