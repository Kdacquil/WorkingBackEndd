import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../../../services/department.service';

@Component({
  selector: 'app-sas',
  templateUrl: './sas.component.html',
  styleUrl: './sas.component.scss'
})
export class SasComponent {
  filteredEmployees: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private employeesService: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchSASEmployees();
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/distribution');
  }

  fetchSASEmployees() {
    this.employeesService.getSASEmployees().subscribe(data => {
      this.filteredEmployees = data;
      console.log('SAS Employees:', this.filteredEmployees);
      this.cdr.detectChanges(); // Ensures UI updates correctly
    });
  }
}

