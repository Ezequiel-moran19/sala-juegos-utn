import { Component, Input } from '@angular/core';
import { Rankings } from '../../interfaces/ranking/ranking';

@Component({
  selector: 'app-ranking',
  imports: [],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking {
  @Input() titulo = '';
  @Input() ranking: Rankings[] = [];
}
