import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordFieldType: string = 'password';
  isLoginView: boolean = true;
  message: string = '';
  messageType: string = '';
  showResendButton: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.email = this.email.trim();
    this.password = this.password.trim();

    if (!this.email || !this.password) {
      this.message = 'Email and password must not be empty';
      this.messageType = 'error';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.message = 'Invalid email format';
      this.messageType = 'error';
      return;
    }

    try {
      const result = await this.authService.login(this.email, this.password);

      if (result.success) {
        this.router.navigate(['/home']);
      } else {
        this.message = result.message;
        this.messageType = 'error';
        this.showResendButton = result.message.includes('verify');
      }
    } catch (error: any) {
      this.message = error.message;
      this.messageType = 'error';
      console.error('Login failed', error);
    }
  }

  async resendVerification() {
    try {
      const result = await this.authService.resendVerificationEmail();
      this.message = result.message;
      this.messageType = result.success ? 'success' : 'error';
    } catch (error: any) {
      this.message = error.message;
      this.messageType = 'error';
      console.error('Failed to resend verification email', error);
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
