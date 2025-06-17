import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:8443/api/v1/avatars';
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
