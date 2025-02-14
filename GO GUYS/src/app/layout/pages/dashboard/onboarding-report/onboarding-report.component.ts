import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { OnboardingReportService } from '../../../../services/onboarding-report.service';

@Component({
  selector: 'app-employee-info',
  standalone: false,
  templateUrl: './onboarding-report.component.html',
  styleUrls: ['./onboarding-report.component.scss']
})
export class OnboardingReportComponent implements OnInit, AfterViewInit {

  searchQuery: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private OnboardingReportService: OnboardingReportService,
    private firestore: AngularFirestore,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  ngAfterViewInit() {
    if (!this.accountContainer) {
      console.error('accountContainer is not initialized');
    }
  }

  fetchEmployees() {
    this.OnboardingReportService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = [...this.employees];
      this.cdr.detectChanges();
    });
  }

  searchEmployee(query: string) {
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(query.toLowerCase())
    );
    this.cdr.detectChanges();
  }

  updateEmployee() {
    console.log("Updating employee:");
  }

  deleteEmployee() {
    console.log("Deleting employee:");
  }

  moveToOffboarding() {
    if (!this.selectedEmployee) {
      alert("Please select an employee to move to offboarding.");
      return;
    }

    const offboardingData = {
      employeeId: this.selectedEmployee.id,
      employeeName: this.selectedEmployee.name,
      department: this.selectedEmployee.department,
      employmentType: this.selectedEmployee.employmentType,
      employmentDate: this.selectedEmployee.employmentDate,
      profileImageUrl: this.selectedEmployee.profileImageUrl
    };

    this.firestore.collection('offboarding').doc(this.selectedEmployee.id).set(offboardingData)
      .then(() => {
        this.firestore.collection('onboarding').doc(this.selectedEmployee.id).delete()
          .then(() => {
            alert("Employee moved to offboarding and removed from onboarding report.");
            this.fetchEmployees(); // Refresh the onboarding report
          })
          .catch(error => alert("Failed to remove from onboarding: " + error.message));
      })
      .catch(error => alert("Failed to move employee to offboarding: " + error.message));
  }

  openModal(employee: any) {
    this.selectedEmployee = employee;
  }

  closeModal() {
    this.selectedEmployee = null;
  }

  @Input() collapsed = false;
  @Input() screenWidth = 0;
  @ViewChild('accountContainer') accountContainer!: ElementRef;
  showAccount = false;

  toggleAccount(event: Event) {
    event.stopPropagation();
    this.showAccount = !this.showAccount;
  }

  openAccountSettings() {
    console.log('Open Account Settings');
  }

  logout() {
    console.log('Logout');
    this.router.navigate(['/loginandsignup']);
  }

  @HostListener('document:click', ['$event'])
  closePopups(event: Event) {
    if (this.accountContainer?.nativeElement) {
      const clickedInsideAccount = this.accountContainer.nativeElement.contains(event.target);
      if (!clickedInsideAccount) {
        this.showAccount = false;
      }
    }
  }
}
