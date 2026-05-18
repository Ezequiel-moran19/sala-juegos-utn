import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { email } from '@angular/forms/signals';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

}
