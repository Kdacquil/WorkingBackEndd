import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sba',
  templateUrl: './sba.component.html',
  styleUrl: './sba.component.scss'
})
export class SbaComponent {
  constructor(private router: Router) { }
  goBack() {
    this.router.navigateByUrl('/dashboard/distribution');
  }
}
