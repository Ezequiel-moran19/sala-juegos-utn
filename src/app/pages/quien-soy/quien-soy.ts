import { Component, inject, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Github } from '../../services/api/github.service';
import { GithubUser } from '../../interfaces/api/github-user.interface';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css'],
})
export class QuienSoy implements OnInit {

  private githubService = inject(Github);
  private cdr = inject(ChangeDetectorRef);
  usuario: GithubUser | null = null;

  ngOnInit(): void {

  this.githubService.obtenerUsuario('Ezequiel-moran19')
  .subscribe({
      next: (data) => {
        this.usuario = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('ERROR API', err);
      }
    });
  }
}