import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service'; // AuthService to get the logged-in user
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  /** 🔹 Log User Actions (Fixed) */
  async logAction(action: string, details: string, status: 'Successful' | 'Failed') {
    const user = await this.authService.getCurrentUser(); // ✅ Await the Promise

    if (!user) return;

    const logData = {
      userId: user.uid,  // ✅ No more Promise issues
      username: user.displayName || 'Unknown User',
      action: action,
      details: details,
      status: status,
      timestamp: new Date()
    };

    return this.firestore.collection('auditLogs').add(logData);
  }

  /** 🔹 Get Audit Logs */
  getAuditLogs(): Observable<any[]> {
    return this.firestore.collection('auditLogs', ref => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          return { id: a.payload.doc.id, ...data };
        }))
      );
  }
}
