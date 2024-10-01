import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LOCAL_STORAGE_CONSTANTS } from '../../app.component';

@Component({
  selector: 'app-set-api-key',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './set-api-key.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetApiKeyComponent {
  control = new FormControl<string | null>('', Validators.required);

  valueSet = output<string>();

  submit() {
    if (this.control.invalid) return;

    const value = this.control.value;

    if (!value) return;

    chrome.storage.local.set({ [LOCAL_STORAGE_CONSTANTS.apiKey]: value });

    this.valueSet.emit(value);
  }
}
