import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'quien-soy', component: QuienSoy },
  {
    path: 'ahorcado', 
    canActivate: [authGuard], 
    loadComponent: () => import('./pages/juegos/ahorcado/ahorcado')
    .then(m => m.Ahorcado)
  },
  {
    path: 'mayor-menor', 
    canActivate: [authGuard], 
    loadComponent: () => import('./pages/juegos/mayor-menor/mayor-menor')
    .then(m => m.MayorMenor)
  },
  {
    path: 'preguntados',  
    canActivate: [authGuard],
    loadComponent: () => import('./pages/juegos/preguntados/preguntados')
    .then(m => m.Preguntados)
  },
  {
    path: 'chat', 
    canActivate: [authGuard], 
    loadComponent: () => import('./pages/chat/chat')
    .then(m => m.Chat)
  },
  { path: '**', redirectTo: '' }

];