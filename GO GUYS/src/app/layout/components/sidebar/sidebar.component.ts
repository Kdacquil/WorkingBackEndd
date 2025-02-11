import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

 constructor(private router: Router, private authService: AuthService) { }
 logout() {
  this.authService.logout();
  console.log('Logout');
  this.router.navigate(['/login']);
}
}
