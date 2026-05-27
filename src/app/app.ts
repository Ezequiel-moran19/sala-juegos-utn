import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { Footer } from "./components/footer/footer";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App{
  protected readonly title = signal('sala-juegos-app');
}