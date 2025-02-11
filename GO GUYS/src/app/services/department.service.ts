import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

   constructor(private firestore: AngularFirestore) {}
    
   getCCJEFEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'College of Criminal Justice Education and Forensics (CCJEF)'))
      .valueChanges();
  }  
  getSBAEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'School of Business Accountancy (SBA)'))
      .valueChanges();
  } 
  getSEAEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'School Of Engineering and Architecture (SEA)'))
      .valueChanges();
  } 
  getSASEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'School of Arts and Sciences (SAS)'))
      .valueChanges();
  } 
  getSHTMEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'School Of Hospitality and Tourism Management (SHTM)'))
      .valueChanges();
  } 
  getSOCEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'School Of Computing (SOC)'))
      .valueChanges();
  } 
  getSEDEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'School Of Education (SED)'))
      .valueChanges();
  } 
  getSNAMSEmployees(): Observable<any[]> {
    return this.firestore
      .collection('employees', ref => ref.where('department', '==', 'School of Nursing and Allied Medical Sciences (SNAMS)'))
      .valueChanges();
  }
}