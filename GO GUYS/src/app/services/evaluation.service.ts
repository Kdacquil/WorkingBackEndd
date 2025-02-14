import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Evaluation } from '../interfaces/evaluation.interface';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  constructor(private firestore: AngularFirestore) {}

  saveEvaluation(evaluation: Evaluation) {
    return this.firestore.collection('evaluations').add(evaluation);
  }

  getEvaluations(employeeId: string): Observable<Evaluation[]> {
    return this.firestore.collection<Evaluation>('evaluations', ref =>
      ref.where('employeeId', '==', employeeId)
    ).valueChanges();
  }

  getEmployeeEvaluations(employeeId: string): Observable<Evaluation[]> {
    return this.firestore.collection<Evaluation>('evaluations', ref =>
      ref.where('employeeId', '==', employeeId).orderBy('date', 'desc')
    ).valueChanges();
  }
}
