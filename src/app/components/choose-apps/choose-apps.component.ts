import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FaDuotoneIconComponent,
  FaIconComponent,
} from '@fortawesome/angular-fontawesome';
import { PayrollApp } from '../../model/model';
import { faLoader, faBriefcase } from '@fortawesome/pro-duotone-svg-icons';

@Component({
  selector: 'app-choose-apps',
  standalone: true,
  imports: [FaDuotoneIconComponent, NgClass],
  templateUrl: './choose-apps.component.html',
  styles: `
    :host {
      height: 100%;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseAppsComponent {
  private cdr = inject(ChangeDetectorRef);

  payrollApps = input<{ loading: boolean; data: PayrollApp[] }>();

  businessSelected = output<PayrollApp>();

  faBriefcase = faBriefcase;
  faLoader = faLoader;

  currentBusiness?: PayrollApp;

  selectBusiness(bus: Required<typeof this.currentBusiness>) {
    this.currentBusiness = bus;
    this.cdr.detectChanges();
  }

  submit() {
    if (!this.currentBusiness) return;

    this.businessSelected.emit(this.currentBusiness);
  }
}
