import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../../../services/department.service';
@Component({
  selector: 'app-sea',
  templateUrl: './sea.component.html',
  styleUrl: './sea.component.scss'
})
export class SeaComponent {
  

  filteredEmployees: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private employeesService: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchSEAEmployees();
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/distribution');
  }

  fetchSEAEmployees() {
    this.employeesService.getSEAEmployees().subscribe(data => {
      this.filteredEmployees = data;
      console.log('SEA Employees:', this.filteredEmployees);
      this.cdr.detectChanges(); // Ensures UI updates correctly
    });
  }
}

