import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiRes, PayrollApp } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private ROOT_URL = environment.rootUrl;

  getBusinesses(key: string) {
    return this.http.get<ApiRes<PayrollApp[]>>(
      `${this.ROOT_URL}/outside/chrome/get_connected_payroll_companies`,
      {
        params: { key },
      },
    );
  }

  postImage(key: string, image: string, app: PayrollApp) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.ROOT_URL}/outside/chrome/save?id=1&key=${key}`,
      { image, app },
    );
  }
}
