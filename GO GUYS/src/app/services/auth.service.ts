import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  // ✅ Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.auth.authState.pipe(map(user => !!user));
  }

  // ✅ Login method (Prevents login if email is not verified)
  async login(email: string, password: string) {
    try {
      if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
      }

      const result = await this.auth.signInWithEmailAndPassword(email, password);
      if (!result.user) {
        return { success: false, message: 'Login failed. Please try again.' };
      }

      if (!result.user.emailVerified) {
        await result.user.sendEmailVerification(); // Send verification email
        await this.auth.signOut(); // Force logout until verified
        return { success: false, message: 'Email not verified. Verification email sent.' };
      }

      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: this.getAuthErrorMessage(error) };
    }
  }

  // ✅ Resend email verification
  async resendVerificationEmail() {
    try {
      const user = await this.auth.currentUser;
      if (user) {
        await user.sendEmailVerification();
        return { success: true, message: 'Verification email sent!' };
      }
      return { success: false, message: 'No user found.' };
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      return { success: false, message: this.getAuthErrorMessage(error) };
    }
  }

  // ✅ Logout method
  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // ✅ Password reset method
  async resetPassword(email: string) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error: any) {
      return { success: false, message: this.getAuthErrorMessage(error) };
    }
  }

  // ✅ Handle Firebase Authentication Errors
  private getAuthErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Wrong password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later.';
      default:
        return 'Login failed. Please try again.';
    }
  }
}
