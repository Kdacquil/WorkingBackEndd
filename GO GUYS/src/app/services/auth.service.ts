import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  // ✅ Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.auth.authState.pipe(map(user => !!user));
  }

  // ✅ Login method with Audit Logging
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
        await result.user.sendEmailVerification();
        await this.auth.signOut();
        this.logAudit(email, 'LOGIN_FAILED', 'Email not verified.');
        return { success: false, message: 'Email not verified. Verification email sent.' };
      }

      // ✅ Log Successful Login
      this.logAudit(email, 'LOGIN_SUCCESS', 'User logged in successfully.');
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      const errorMessage = this.getAuthErrorMessage(error);
      this.logAudit(email, 'LOGIN_FAILED', errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  // ✅ Resend Email Verification
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

  // ✅ Get Current User
  async getCurrentUser(): Promise<any> {
    return this.auth.currentUser;
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

  // ✅ Update User Information
  async updateUserInfo(updates: { email?: string; password?: string; displayName?: string }) {
    try {
      const user = await this.auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not found.' };
      }

      if (updates.email) {
        await user.updateEmail(updates.email);
      }
      if (updates.password) {
        await user.updatePassword(updates.password);
      }
      if (updates.displayName) {
        await user.updateProfile({ displayName: updates.displayName });
      }

      // ✅ Log update action
      this.logAudit(user.email || 'Unknown', 'UPDATE_USER', `Updated fields: ${Object.keys(updates).join(', ')}`);

      return { success: true, message: 'User information updated successfully.' };
    } catch (error: any) {
      return { success: false, message: this.getAuthErrorMessage(error) };
    }
  }

  // ✅ Delete User Account (with Firestore Cleanup)
  async deleteUserAccount() {
    try {
      const user = await this.auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not found.' };
      }

      const userEmail = user.email || 'Unknown';

      // Remove user from Firestore
      await this.firestore.collection('users').doc(user.uid).delete();

      // Delete user from Firebase Authentication
      await user.delete();

      // ✅ Log deletion
      this.logAudit(userEmail, 'DELETE_USER', 'User account deleted.');

      return { success: true, message: 'User account deleted successfully.' };
    } catch (error: any) {
      return { success: false, message: this.getAuthErrorMessage(error) };
    }
  }

  // ✅ Log Audit Events to Firestore
  private logAudit(email: string, action: string, details: string) {
    const logEntry = {
      email,
      action,
      details,
      timestamp: new Date()
    };

    this.firestore.collection('auditLogs').add(logEntry)
      .then(() => console.log('Audit Log recorded:', logEntry))
      .catch(error => console.error('Error logging event:', error));
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
      case 'auth/requires-recent-login':
        return 'This action requires you to log in again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
