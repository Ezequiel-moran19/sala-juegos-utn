import { Component, Input } from '@angular/core';
import { Rankings } from '../../interfaces/ranking/ranking';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class RankingComponent {
  @Input() titulo = '';
  @Input() ranking: Rankings[] = [];
}
