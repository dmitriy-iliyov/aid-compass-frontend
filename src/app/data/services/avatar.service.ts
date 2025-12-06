import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}/v1/avatars`;
  constructor() {}

  save(id: string, file: File) {
    console.log(id)
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put<any>(
      `${this.baseApiUrl}`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
}
