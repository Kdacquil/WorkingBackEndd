import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OffboardService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // 🔹 Upload file to Firebase Storage
  uploadFile(file: File, fileType: 'clearance' | 'certification', employeeId: string): Observable<string> {
    const path = `offboarding/${employeeId}/${fileType}/${file.name}`;
    const storageRef = this.storage.ref(path);
    const task = this.storage.upload(path, file);

    return from(task).pipe(
      switchMap(() => storageRef.getDownloadURL())
    );
  }

  // 🔹 Save offboarding data to Firestore
  saveOffboardingData(employeeId: string, data: any): Promise<void> {
    return this.firestore.collection('offboarding').doc(employeeId).set({
      ...data,
      timestamp: new Date(),
      status: 'pending'
    });
  }

  // 🔹 Get offboarding records
  getOffboardingRecords(): Observable<any[]> {
    return this.firestore.collection('offboarding').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...(data as object) };
      }))
    );
  }
}
