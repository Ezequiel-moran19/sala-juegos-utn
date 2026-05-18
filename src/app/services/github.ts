import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class Github {
  private http = inject(HttpClient);

  obtenerUsuario(username: string) {
    return this.http.get(`https://api.github.com/users/${username}`);
  }
}
