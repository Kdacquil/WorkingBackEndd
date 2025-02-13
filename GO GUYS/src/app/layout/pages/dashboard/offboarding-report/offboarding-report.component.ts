import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { OffboardingReportService } from '../../../../services/offboard-report.service';




@Component({
  selector: 'app-offboarding-report',
  templateUrl: './offboarding-report.component.html',
  styleUrl: './offboarding-report.component.scss'
})
export class OffboardingReportComponent {
searchQuery: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private OffboardingReportService: OffboardingReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.OffboardingReportService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = [...this.employees];
      console.log('Users:', this.employees);
    });
  }

  // ngAfterViewInit() {
  //   if (!this.accountContainer) {
  //     console.error('accountContainer is not initialized');
  //   }
  // }

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
    console.log("Moving to offboarding:");
  }

  openModal(employee: any) {
    console.log("Opening modal for:", employee);
    this.selectedEmployee = employee;
  }

  showDetails(employee: any) {
    this.selectedEmployee = employee;
  }

  closeModal() {
    this.selectedEmployee = null;
  }

  // @Input() collapsed = false;
  // @Input() screenWidth = 0;
  // @ViewChild('accountContainer') accountContainer!: ElementRef;
  // showAccount = false;

  // toggleAccount(event: Event) {
  //   event.stopPropagation();
  //   this.showAccount = !this.showAccount;
  // }

  openAccountSettings() {
    console.log('Open Account Settings');
  }

  logout() {
    console.log('Logout');
    this.router.navigate(['/loginandsignup']);
  }

  // @HostListener('document:click', ['$event'])
  // closePopups(event: Event) {
  //   if (this.accountContainer?.nativeElement) { // Check if element exists before accessing
  //     const clickedInsideAccount = this.accountContainer.nativeElement.contains(event.target);
  //     if (!clickedInsideAccount) {
  //       this.showAccount = false;
  //     }
  //   }
  // }
}
