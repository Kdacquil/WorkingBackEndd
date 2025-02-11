import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../../../services/department.service';
@Component({
  selector: 'app-ccjef',
  templateUrl: './ccjef.component.html',
  styleUrl: './ccjef.component.scss'
})
export class CcjefComponent {
  

  filteredEmployees: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private employeesService: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchCCJEFEmployees();
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/distribution');
  }

  fetchCCJEFEmployees() {
    this.employeesService.getCCJEFEmployees().subscribe(data => {
      this.filteredEmployees = data;
      console.log('CCJEF Employees:', this.filteredEmployees);
      this.cdr.detectChanges(); // Ensures UI updates correctly
    });
  }
}

