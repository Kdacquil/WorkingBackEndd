import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../../../services/department.service';
@Component({
  selector: 'app-ccjef',
  templateUrl: './sed.component.html',
  styleUrl: './sed.component.scss'
})
export class SedComponent {
  

  filteredEmployees: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private employeesService: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchSEDEmployees();
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/distribution');
  }

  fetchSEDEmployees() {
    this.employeesService.getSEDEmployees().subscribe(data => {
      this.filteredEmployees = data;
      console.log('SED Employees:', this.filteredEmployees);
      this.cdr.detectChanges(); // Ensures UI updates correctly
    });
  }
}

