import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  deleteEmployee(id: string) {
    throw new Error('Method not implemented.');
  }
  private collectionName = 'employees'; // Firestore collection for employees

  constructor(private firestore: AngularFirestore) {}

  // Get all employees
  getEmployees(): Observable<any[]> {
    return this.firestore.collection(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Get a single employee by ID
  getEmployeeById(employeeId: string): Observable<any> {
    return this.firestore.collection(this.collectionName).doc(employeeId).valueChanges();
  }

  // Update employee status after offboarding
  updateEmployeeStatus(employeeId: string, status: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(employeeId).update({ status: status });
  }
}
