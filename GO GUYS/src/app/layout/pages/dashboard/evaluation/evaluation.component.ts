import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingReportService } from '../../../../services/onboarding-report.service';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss'
})
export class EvaluationComponent {
searchQuery: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private OnboardingReportService: OnboardingReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.OnboardingReportService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = [...this.employees];
      console.log('Users:', this.employees);
    });
  }

  openModal(employee: any) {
    this.selectedEmployee = { ...employee };
  }

  closeModal() {
    this.selectedEmployee = null;
  }
  
}
