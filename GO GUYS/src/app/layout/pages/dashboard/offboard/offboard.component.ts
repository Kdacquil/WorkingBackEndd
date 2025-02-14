import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { OffboardService } from '../../../../services/offboard.service';

@Component({
  selector: 'app-offboard',
  templateUrl: './offboard.component.html',
  styleUrls: ['./offboard.component.scss']
})
export class OffboardComponent implements OnInit {
  searchQuery: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  employeeId: string = '';
  employeeName: string = '';
  profileImageUrl: string = 'picpro.jpg';
  offboardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private offboardService: OffboardService,
    private firestore: AngularFirestore
  ) {
    this.offboardForm = this.fb.group({
      effectiveDate: ['', Validators.required],
      personalEmail: ['', [Validators.required, Validators.email]],
      exitInterview: ['', Validators.required],
      automatedNotification: ['', Validators.required],
      clearanceStatus: ['', Validators.required],
      certificationStatus: ['', Validators.required],
      recommendation: ['', Validators.required],
      recommendationComment: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.firestore.collection('employees').snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    ).subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees = [];
    });
  }

  searchEmployees() {
    if (this.searchQuery.trim() === '') {
      this.filteredEmployees = [];
      return;
    }
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectEmployee(employee: any) {
    this.employeeId = employee.id;
    this.employeeName = employee.name;
    this.profileImageUrl = employee.profileImageUrl || 'picpro.jpg';
    this.searchQuery = employee.name;
    this.filteredEmployees = [];
  }

  submitForm() {
    if (!this.employeeId) {
      alert("Please select an employee before submitting.");
      return;
    }

    if (this.offboardForm.valid) {
      const offboardingData = {
        employeeId: this.employeeId,
        employeeName: this.employeeName,
        profileImageUrl: this.profileImageUrl,
        ...this.offboardForm.value
      };

      // Save offboarding data
      this.offboardService.saveOffboardingData(this.employeeId, offboardingData)
        .then(() => {
          // Remove from onboarding report
          this.firestore.collection('onboarding').doc(this.employeeId).delete()
            .then(() => {
              alert("Employee offboarded and removed from onboarding report successfully!");
            })
            .catch(error => alert("Failed to remove employee from onboarding report: " + error.message));
        })
        .catch(error => alert("Failed to save offboarding data: " + error.message));
    } else {
      alert("Please fill in all required fields.");
    }
  }
}

