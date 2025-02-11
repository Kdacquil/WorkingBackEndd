import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  @ViewChild('accountContainer') accountContainer!: ElementRef;
  showAccount = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleAccount(event: Event) {
    event.stopPropagation();
    this.showAccount = !this.showAccount;
  }

  onboard() {
    this.router.navigate(['/dashboard/onboard']);
  }

  offboard() {
    this.router.navigate(['/dashboard/offboard']);
  }

  openAccountSettings() {
    console.log('Open Account Settings');
  }

  async logout() {
    await this.authService.logout();
  }

  homepage() {
    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  closePopups(event: Event) {
    if (this.accountContainer) {
      const clickedInsideAccount = this.accountContainer.nativeElement.contains(event.target);
      if (!clickedInsideAccount) {
        this.showAccount = false;
      }
    }
  }
}
