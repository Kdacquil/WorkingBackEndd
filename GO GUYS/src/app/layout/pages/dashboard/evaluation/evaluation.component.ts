import { Component, OnInit } from '@angular/core';
import { Evaluation } from '../../../../interfaces/evaluation.interface';
import { EvaluationService } from '../../../../services/evaluation.service';
import { OnboardingReportService } from '../../../../services/onboarding-report.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedEmployee: any = null;
  evaluationData: any = {};
  evaluationHistory: Evaluation[] = [];
  evaluationCriteria = [
    { description: 'Possesses necessary credentials and certifications', category: 'QUALIFICATIONS & COMPETENCE', rating: 0, points: 0 },
    { description: 'Demonstrates subject expertise', category: 'QUALIFICATIONS & COMPETENCE', rating: 0, points: 0 },
    { description: 'Aligns lesson plans with the curriculum', category: 'QUALIFICATIONS & COMPETENCE', rating: 0, points: 0 },
    { description: 'Integrates technology into teaching', category: 'QUALIFICATIONS & COMPETENCE', rating: 0, points: 0 },
    { description: 'Participates in professional development', category: 'QUALIFICATIONS & COMPETENCE', rating: 0, points: 0 },

    { description: 'Engages students effectively', category: 'TEACHING EFFECTIVENESS', rating: 0, points: 0 },
    { description: 'Maintains structured classroom management', category: 'TEACHING EFFECTIVENESS', rating: 0, points: 0 },
    { description: 'Adapts methods to diverse learning needs', category: 'TEACHING EFFECTIVENESS', rating: 0, points: 0 },
    { description: 'Uses appropriate assessments and feedback', category: 'TEACHING EFFECTIVENESS', rating: 0, points: 0 },
    { description: 'Handles discipline fairly and professionally', category: 'TEACHING EFFECTIVENESS', rating: 0, points: 0 },

    { description: 'Communicates effectively with all stakeholders', category: 'COMMUNICATION & COLLABORATION', rating: 0, points: 0 },
    { description: 'Builds strong interpersonal relationships', category: 'COMMUNICATION & COLLABORATION', rating: 0, points: 0 },
    { description: 'Provides constructive feedback to students', category: 'COMMUNICATION & COLLABORATION', rating: 0, points: 0 },
    { description: 'Participates actively in school activities', category: 'COMMUNICATION & COLLABORATION', rating: 0, points: 0 },
    { description: 'Resolves conflicts professionally', category: 'COMMUNICATION & COLLABORATION', rating: 0, points: 0 },

    { description: 'Meets deadlines and responsibilities', category: 'WORK ETHICS & PROFESSIONALISM', rating: 0, points: 0 },
    { description: 'Maintains reliability and punctuality', category: 'WORK ETHICS & PROFESSIONALISM', rating: 0, points: 0 },
    { description: 'Follows ethical practices and policies', category: 'WORK ETHICS & PROFESSIONALISM', rating: 0, points: 0 },
    { description: 'Responds well to constructive criticism', category: 'WORK ETHICS & PROFESSIONALISM', rating: 0, points: 0 },
    { description: 'Recommended for continued employment or promotion', category: 'WORK ETHICS & PROFESSIONALISM', rating: 0, points: 0 }
  ];
  loading = false;
  searchQuery: string = '';

  constructor(
    private onboardingReportService: OnboardingReportService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit() {
    this.onboardingReportService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = [...this.employees];
    });
  }

  filterEmployees() {
    const query = this.searchQuery?.toLowerCase() || '';
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name?.toLowerCase().includes(query)
    );
  }

  // openModal(employee: any) {
  //   if (!employee?.id) {
  //     console.error('Employee ID is undefined');
  //     alert('Employee ID is missing. Please try again.');
  //     return;
  //   }
  //   this.selectedEmployee = { ...employee };
  //   this.loadEvaluationHistory(employee.id);
  //   this.evaluationData = {
  //     employeeId: employee.id,
  //     employeeName: employee.name,
  //     criteria: this.evaluationCriteria.map(c => ({ ...c }))
  //   };
  // }

  openModal(employee: any) {
    if (!employee?.id) {
      console.error('Employee ID is undefined');
      alert('Employee ID is missing. Please try again.');
      return;
    }
  
    this.selectedEmployee = { ...employee };
    this.loadEvaluationHistory(employee.id);
  
    // Ensure criteria ratings and points reset to 0
    this.evaluationData = {
      employeeId: employee.id,
      employeeName: employee.name,
      criteria: this.evaluationCriteria.map(c => ({
        ...c,
        rating: 0,  // Default rating
        points: 0   // Default points
      }))
    };
  }
  

  closeModal() {
    this.selectedEmployee = null;
  }

  // loadEvaluationHistory(employeeId: string) {
  //   if (!employeeId) {
  //     console.error('Employee ID is undefined');
  //     alert('Employee ID is missing. Please try again.');
  //     return;
  //   }
  //   this.loading = true;
  //   this.evaluationService.getEvaluations(employeeId).subscribe((history: Evaluation[]) => {
  //     this.evaluationHistory = history.map(item => {
  //       let dateObj = item.date instanceof Date ? item.date : new Date(item.date);
  //       if (isNaN(dateObj.getTime())) {
  //         console.error('Invalid date:', item.date);
  //         dateObj = new Date();
  //       }
  //       return {
  //         ...item,
  //         date: dateObj
  //       };
  //     });
  //     this.loading = false;
  //   }, () => this.loading = false);
  // }
  loadEvaluationHistory(employeeId: string) {
    if (!employeeId) {
      console.error('Employee ID is undefined');
      alert('Employee ID is missing. Please try again.');
      return;
    }
  
    this.loading = true;
    this.evaluationService.getEvaluations(employeeId).subscribe(
      (history: Evaluation[]) => {
        console.log('Received history from Firestore:', history);
  
        this.evaluationHistory = history.map(item => {
          let dateObj: Date;
        
          if (item.date instanceof Timestamp) {
            dateObj = item.date.toDate(); // Convert Firestore Timestamp to JavaScript Date
          } else if (item.date instanceof Date) {
            dateObj = item.date; // Already a valid JavaScript Date
          } else if (typeof item.date === 'string') {
            dateObj = new Date(item.date); // Convert string to Date
          } else {
            console.warn('Invalid date detected:', item.date);
            dateObj = new Date(0); // Use a default Date instead of null
          }
        
          return {
            ...item,
            date: dateObj, // Ensures type remains Date
          };
        });
        
  
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching evaluation history:', error);
        this.loading = false;
      }
    );
  }

  onRatingChange(criterion: any, event: any) {
    const rating = +event.target.value;
    criterion.rating = rating;
    criterion.points = rating;
  }

  calculateTotalPoints(): number {
    return this.evaluationCriteria.reduce((sum, c) => sum + c.points, 0);
  }

  submitEvaluation() {
    if (!this.selectedEmployee?.id) {
      console.error('Selected employee ID is undefined');
      alert('Cannot submit evaluation without a valid employee ID.');
      return;
    }
    this.loading = true;
    const evaluation: Evaluation = {
      employeeId: this.selectedEmployee.id,
      employeeName: this.selectedEmployee.name,
      criteria: this.evaluationCriteria.map(c => ({ description: c.description, rating: c.rating, points: c.points, category: c.category })),
      totalPoints: this.calculateTotalPoints(),
      date: new Date()
    };
    this.evaluationService.saveEvaluation(evaluation).then(() => {
      alert('Evaluation saved successfully!');
      this.closeModal();
    }).catch(error => {
      console.error('Error saving evaluation:', error);
      alert('Failed to save evaluation. Please try again later.');
    }).finally(() => {
      this.loading = false;
    });
  }
}
