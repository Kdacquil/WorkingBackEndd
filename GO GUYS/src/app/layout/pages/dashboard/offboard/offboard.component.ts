import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffboardService } from '../../../../services/offboard.service';

@Component({
  selector: 'app-offboard',
  templateUrl: './offboard.component.html',
  styleUrls: ['./offboard.component.scss']
})
export class OffboardComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  employeeId: string = '';
  employeeName: string = '';
  profileImageUrl: string = 'picpro.jpg';
  offboardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private offboardService: OffboardService,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.offboardForm = this.fb.group({
      effectiveDate: ['', Validators.required],
      personalEmail: ['', [Validators.required, Validators.email]],
      exitInterview: ['', Validators.required],
      automatedNotification: ['', Validators.required],
      clearanceFileUrl: [''],
      certificationFileUrl: ['']
    });
  }

  ngOnInit() {}

  // Search Employees in Firestore (Only Shows When Typing)
  searchEmployees() {
    if (this.searchQuery.trim() !== '') {
      this.firestore.collection('employees', ref => ref
        .orderBy('name')
        .startAt(this.searchQuery)
        .endAt(this.searchQuery + '\uf8ff'))
        .valueChanges()
        .subscribe(results => {
          this.searchResults = results;
        });
    } else {
      this.searchResults = [];
    }
  }

  // Select Employee and Auto-Fill Details
  selectEmployee(employee: any) {
    this.employeeId = employee.id;
    this.employeeName = employee.name;
    this.profileImageUrl = employee.profileImageUrl || 'picpro.jpg';
    this.searchQuery = '';
    this.searchResults = [];
  }

  // Handle File Upload
  handleFileUpload(event: any, fileType: 'clearance' | 'certification') {
    const file = event.target.files[0];
    if (file && this.employeeId) {
      this.offboardService.uploadFile(file, fileType, this.employeeId).subscribe(
        downloadUrl => {
          const control = fileType === 'clearance' ? 'clearanceFileUrl' : 'certificationFileUrl';
          this.offboardForm.patchValue({ [control]: downloadUrl });
        },
        error => {
          console.error('Error uploading file:', error);
          alert(`Failed to upload ${fileType}.`);
        }
      );
    } else {
      alert('Invalid file or missing employee ID.');
    }
  }

  // Submit Offboarding Data
  submitForm() {
    if (this.offboardForm.valid) {
      alert('Offboarding data submitted successfully!');
      this.offboardForm.reset();
    } else {
      alert('Please fill in all required fields');
    }
  }
}
