import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {
  private basePath = '/employees';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  // Upload image to Firebase Storage
  async uploadImage(file: File): Promise<string> {
    const filePath = `${this.basePath}/${new Date().getTime()}_${file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe({
            next: (downloadUrl) => resolve(downloadUrl),
            error: (error) => reject(error)
          });
        })
      ).subscribe();
    });
  }

  // Add new employee
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

      return docRef.id;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  }

  // Get all employees
  getEmployees(): Observable<Employee[]> {
    return this.firestore.collection<Employee>(this.basePath)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Employee;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  // Get employee by ID
  getEmployeeById(id: string): Observable<Employee | undefined> {
    return this.firestore.doc<Employee>(`${this.basePath}/${id}`).valueChanges();
  }

  // Update employee
  updateEmployee(id: string, employee: Partial<Employee>): Promise<void> {
    return this.firestore.doc(`${this.basePath}/${id}`).update(employee);
  }

  // Delete employee
  deleteEmployee(id: string): Promise<void> {
    return this.firestore.doc(`${this.basePath}/${id}`).delete();
  }
}
