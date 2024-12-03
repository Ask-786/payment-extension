import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { SetApiKeyComponent } from './components/set-api-key/set-api-key.component';
import {
  FaDuotoneIconComponent,
  FaIconComponent,
} from '@fortawesome/angular-fontawesome';
import { faQuestion, faX } from '@fortawesome/free-solid-svg-icons';
import { TakeScreenshotComponent } from './components/take-screenshot/take-screenshot.component';
import { ChooseAppsComponent } from './components/choose-apps/choose-apps.component';
import { SuccessPageComponent } from './components/success-page/success-page.component';
import { ApiService } from './services/api.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FlowSteps, PayrollApp } from './model/model';
import { faLoader } from '@fortawesome/pro-duotone-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

export const LOCAL_STORAGE_CONSTANTS = {
  apiKey: 'api-key',
};

@Component({
  selector: 'app-root',
  imports: [
    SetApiKeyComponent,
    FaIconComponent,
    FaDuotoneIconComponent,
    TakeScreenshotComponent,
    ChooseAppsComponent,
    SuccessPageComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private apiService = inject(ApiService);

  apiKey?: string;
  hasKey = false;
  image?: string;

  faQuestion = faQuestion;
  faX = faX;
  faLoader = faLoader;

  destroy$ = new Subject<boolean>();

  payrollApps = signal<{ loading: boolean; data: PayrollApp[] }>({
    loading: false,
    data: [],
  });

  loading = signal(false);
  currentStep = signal<FlowSteps>('SET_API_KEY');

  constructor() {
    this.initialSetup();
  }

  async initialSetup() {
    const localStorageValues = await chrome.storage.local.get(
      LOCAL_STORAGE_CONSTANTS.apiKey,
    );

    this.apiKey = localStorageValues?.[LOCAL_STORAGE_CONSTANTS.apiKey];

    this.hasKey = Boolean(this.apiKey);

    if (this.hasKey) {
      this.currentStep.set('TAKE_SCREENSHOT');
      this.getPayrollApps(<string>this.apiKey);
      this.cdr.detectChanges();
    }
  }

  setApiKey(val: string) {
    if (!val) return;

    this.currentStep.set('TAKE_SCREENSHOT');
    this.apiKey = val;
    this.hasKey = true;
    this.getPayrollApps(val);
    this.cdr.detectChanges();
  }

  getPayrollApps(key: string) {
    this.payrollApps.update((val) => ({ ...val, loading: true }));
    this.apiService
      .getBusinesses(key)
      .pipe(
        finalize(() => {
          this.payrollApps.update((val) => ({ ...val, loading: false }));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (res) => {
          if (!res.success) return;
          this.payrollApps.update((val) => ({ ...val, data: res.data }));
        },
        error: (err: HttpErrorResponse) => {
          if (err) {
            chrome.storage.local.remove(LOCAL_STORAGE_CONSTANTS.apiKey);
            window.close();
          }
        },
      });
  }

  setImage(img: string) {
    if (!img) return;
    this.currentStep.set('CHOOSE_APPS');
    this.image = img;
    this.cdr.detectChanges();
  }

  setPayrollApp(app: PayrollApp) {
    if (!this.apiKey || !this.image) return;

    this.makePayment(this.apiKey, this.image, app);
  }

  makePayment(key: string, image: string, app: PayrollApp) {
    this.loading.set(true);
    this.apiService
      .postImage(key, image, app)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((val) => {
        if (!val.success) return;

        this.currentStep.set('SUCCESS_PAGE');
      });
  }

  removeApiKey(val: boolean) {
    if (!val) return;

    chrome.storage.local.remove(LOCAL_STORAGE_CONSTANTS.apiKey);
    this.currentStep.set('SET_API_KEY');
  }

  close() {
    window.close();
  }

  openHelp() {
    window.open(environment.helpUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
