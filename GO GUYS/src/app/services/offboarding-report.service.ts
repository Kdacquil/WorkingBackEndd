import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffboardingReportService {

  constructor(private firestore: AngularFirestore) {}
    
      getEmployees(): Observable<any[]> {
        return this.firestore.collection('offboarding').valueChanges();
      }
    }
    