import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {
  private basePath = '/employees';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async addEmployee(employee: Employee, imageFile?: File): Promise<string> {
    try {
      if (imageFile) {
        const imageUrl = await this.uploadImage(imageFile);
        employee.profileImageUrl = imageUrl;
      }

      const docRef = await this.firestore.collection(this.basePath).add({
        ...employee,
        createdAt: new Date()
      });

      this.logAudit({
        email: employee.email,
        action: 'EMPLOYEE_ONBOARDED',
        timestamp: new Date(),
        details: `Employee ${employee.name} onboarded successfully`
      });

      return docRef.id;
    } catch (addError: unknown) {
      if (addError instanceof Error) {
        console.error('Error adding employee:', addError);

        this.logAudit({
          email: employee.email,
          action: 'ONBOARDING_FAILED',
          timestamp: new Date(),
          details: `Failed to onboard employee ${employee.name}: ${addError.message}`
        });
      } else {
        console.error('Unknown error:', addError);
      }
      throw addError;
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const filePath = `${this.basePath}/${new Date().getTime()}_${file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const downloadUrl = await storageRef.getDownloadURL().toPromise();
            resolve(downloadUrl);
          } catch (uploadError) {
            reject(uploadError);
          }
        })
      ).subscribe();
    });
  }

  private logAudit(log: { email: string; action: string; timestamp: Date; details: string }) {
    this.firestore.collection('auditLogs').add(log)
      .then(() => console.log('Audit Log recorded:', log))
      .catch(logError => console.error('Error logging event:', logError));
  }
}
