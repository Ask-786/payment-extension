import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  output,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCamera, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-take-screenshot',
  standalone: true,
  imports: [FaIconComponent, NgClass],
  templateUrl: './take-screenshot.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakeScreenshotComponent {
  private cdr = inject(ChangeDetectorRef);

  setFile = output<string>();
  removeApiKey = output<boolean>();

  faCamera = faCamera;
  faPlus = faPlus;

  url?: string;

  async captureFile() {
    const url = await chrome.tabs.captureVisibleTab();

    if (!url) {
      alert('something went wrong');
      return;
    }

    this.url = url;
    this.cdr.detectChanges();
  }

  removeImage() {
    this.url = undefined;
    this.cdr.detectChanges();
  }

  continue() {
    if (!this.url) return;
    this.setFile.emit(this.url);
  }

  removeKey() {
    this.removeApiKey.emit(true);
  }
}
