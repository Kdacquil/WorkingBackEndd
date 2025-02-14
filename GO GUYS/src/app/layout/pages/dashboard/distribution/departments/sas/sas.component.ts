import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sas',
  templateUrl: './sas.component.html',
  styleUrl: './sas.component.scss'
})
export class SasComponent {
  constructor(private router: Router) { }
  goBack() {
    this.router.navigateByUrl('/dashboard/distribution');
  }
}

