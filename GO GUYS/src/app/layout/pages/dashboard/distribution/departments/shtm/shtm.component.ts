import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../../../services/department.service';
@Component({
  selector: 'app-shtm',
  templateUrl: './shtm.component.html',
  styleUrl: './shtm.component.scss'
})
export class ShtmComponent {
  filteredEmployees: any[] = [];
    selectedEmployee: any = null;
  
    constructor(
      private router: Router,
      private elementRef: ElementRef,
      private employeesService: DepartmentService,
      private cdr: ChangeDetectorRef
    ) {}
  
    ngOnInit() {
      this.fetchSHTMEmployees();
    }
  
    goBack() {
      this.router.navigateByUrl('/dashboard/distribution');
    }
  
    fetchSHTMEmployees() {
      this.employeesService.getSHTMEmployees().subscribe(data => {
        this.filteredEmployees = data;
        console.log('SHTM Employees:', this.filteredEmployees);
        this.cdr.detectChanges(); // Ensures UI updates correctly
      });
    }
  }
  
