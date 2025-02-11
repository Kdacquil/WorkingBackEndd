import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  addOnboardingData(data: any): Promise<void> {
    const email = data.email;
    return this.firestore.collection('onboarding').doc(email).set(data);
  }

  uploadProfileImage(file: File): Observable<string> {
    const filePath = `profile-images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable((observer) => {
      task.then(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          observer.next(url);
          observer.complete();
        });
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
