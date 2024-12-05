import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LOCAL_STORAGE_CONSTANTS } from '../../app.component';
import { NgClass } from '@angular/common';
import { ApiService } from '../../services/api.service';
import {
  catchError,
  finalize,
  firstValueFrom,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { ApiRes } from '../../model/model';

@Component({
  selector: 'app-set-api-key',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './set-api-key.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetApiKeyComponent implements OnDestroy {
  private apiService = inject(ApiService);

  valueSet = output<string>();

  loading = signal(false);

  destroy$ = new Subject();

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  error = signal('');

  async submit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    if (!username || !password) return;

    this.loading.set(true);
    const res = await firstValueFrom(
      this.apiService.getToken({ username, password }).pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        catchError((err) => {
          this.error.set(err.error.message);
          return of({ success: false });
        }),
        takeUntil(this.destroy$),
      ),
    );

    if (!res.success) return;

    const apiKey = (res as ApiRes<string>).data;

    await chrome.storage.local.set({
      [LOCAL_STORAGE_CONSTANTS.apiKey]: apiKey,
    });
    this.valueSet.emit(apiKey);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
