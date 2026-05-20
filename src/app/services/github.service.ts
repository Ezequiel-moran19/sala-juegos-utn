import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GithubUser } from '../interfaces/github-user.interface';

@Injectable({
  providedIn: 'root',
})

export class Github {
  private http = inject(HttpClient);

  obtenerUsuario(username: string) {
    return this.http.get<GithubUser>(`https://api.github.com/users/${username}`);
  }
}
