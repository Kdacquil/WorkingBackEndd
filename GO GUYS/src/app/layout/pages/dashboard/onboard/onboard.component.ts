import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  profileImage: string = 'picpro.jpg'; // Default profile image
  selectedFile: File | null = null;
  uploadedFiles: { name: string; type: string; url: string }[] = []; // Store uploaded documents

  formData = {
    name: '',
    email: '',
    employmentDate: '',
    employmentType: '',
    department: '',
    notification: '',
    profileImageUrl: '',
    documents: [] as { name: string; type: string; url: string }[] // Store uploaded document links
  };

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  /**
   * Upload the profile image to Firebase Storage
   */
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `profile-images/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Upload progress (optional)
      task.percentageChanges().subscribe(progress => {
        console.log(`Upload is ${progress}% done`);
      });

      // After the upload, get the download URL and update the profile image
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.profileImage = url;  // Update profile image URL after upload
            this.formData.profileImageUrl = url;  // Store the URL in the form data
          });
        })
      ).subscribe();
    }
  }

  /**
   * Upload multiple documents to Firebase Storage
   */
  uploadFiles(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const filePath = `employee_documents/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Upload progress (optional)
      task.percentageChanges().subscribe(progress => {
        console.log(`Upload is ${progress}% done`);
      });

      // After upload, get the download URL and store document details
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.uploadedFiles.push({
              name: file.name,
              type: file.type,
              url: url
            });
          });
        })
      ).subscribe();
    });
  }

  /**
   * Handle form submission and save employee data in Firestore
   */
  async onSubmit(form: NgForm) {
    if (form.valid) {
      try {
        // Store uploaded document details in formData
        this.formData.documents = this.uploadedFiles;

        // Save employee data (including profile image and documents) to Firestore
        const docRef = await this.firestore.collection('employees').add(this.formData);
        console.log('Document written with ID:', docRef.id);

        // Reset form after successful submission
        form.resetForm();
        this.uploadedFiles = [];
        this.profileImage = 'picpro.jpg'; // Reset to default profile image
        alert('Employee added successfully!');
      } catch (error) {
        console.error('Error in form submission:', error);
        alert('Error saving employee data. Please try again.');
      }
    } else {
      console.log('Form is invalid', form.errors);
    }
  }
}
