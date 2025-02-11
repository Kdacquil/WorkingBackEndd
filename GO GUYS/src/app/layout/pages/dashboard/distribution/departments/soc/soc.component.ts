import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../../../services/department.service';
@Component({
  selector: 'app-soc',
  templateUrl: './soc.component.html',
  styleUrl: './soc.component.scss'
})
export class SocComponent {
  filteredEmployees: any[] = [];
    selectedEmployee: any = null;
  
    constructor(
      private router: Router,
      private elementRef: ElementRef,
      private employeesService: DepartmentService,
      private cdr: ChangeDetectorRef
    ) {}
  
    ngOnInit() {
      this.fetchSOCEmployees();
    }
  
    goBack() {
      this.router.navigateByUrl('/dashboard/distribution');
    }
  
    fetchSOCEmployees() {
      this.employeesService.getSOCEmployees().subscribe(data => {
        this.filteredEmployees = data;
        console.log('SOC Employees:', this.filteredEmployees);
        this.cdr.detectChanges(); // Ensures UI updates correctly
      });
    }
  }
  
