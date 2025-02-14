import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnboardingReportService {

  constructor(private firestore: AngularFirestore) {}

  // Get employees from the employees collection
  getEmployees(): Observable<any[]> {
    return this.firestore.collection('employees').valueChanges();
  }

  // Remove employee from onboarding after offboarding
  removeEmployee(employeeId: string): Promise<void> {
    return this.firestore.collection('employees').doc(employeeId).delete();
  }
}

