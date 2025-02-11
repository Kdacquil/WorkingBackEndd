import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-snams',
  templateUrl: './snams.component.html',
  styleUrl: './snams.component.scss'
})
export class SnamsComponent {
  constructor(private router: Router) { }
  goBack() {
    this.router.navigateByUrl('/dashboard/distribution');
  }
}
