import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('departmentDistribution') departmentChartRef!: ElementRef;

  chartDepartment: Chart | null = null;
  chartEmployment: Chart | null = null;
  showContent = true;
  private routerSubscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showContent = this.router.url === '/dashboard/distribution';

        if (this.showContent) {
          setTimeout(() => {
            this.destroyCharts(); // Ensure charts are destroyed before rendering
            this.renderDepartmentDistribution();
          }, 0);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.showContent) {
      this.renderDepartmentDistribution();
    }
  }

  renderDepartmentDistribution() {
    if (this.chartDepartment) {
      this.chartDepartment.destroy();
    }

    if (this.departmentChartRef?.nativeElement) {
      const ctx = this.departmentChartRef.nativeElement as HTMLCanvasElement;
      this.chartDepartment = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['SBA', 'SEA', 'SOC', 'SAS', 'SNAMS', 'SED', 'SHTM', 'CCJEF'],
          datasets: [{
            data: [20, 30, 25, 10, 15, 10, 45, 30],
            backgroundColor: ['#cc9933', '#cc3300', '#FF9900', '#663333', '#006600', '#003366', '#cc3366', '#800080']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (event, elements) => {
            if (elements.length > 0 && this.chartDepartment?.data?.labels) {
              const index = elements[0].index;
              const label = this.chartDepartment.data.labels[index] as string;
              this.navigateToRoute(label);
            }
          }
        }
      });
    }
  }

  navigateToRoute(label: string) {
    const routes: { [key: string]: string } = {
      'SBA': '/dashboard/distribution/sba',
      'SEA': '/dashboard/distribution/sea',
      'SOC': '/dashboard/distribution/soc',
      'SAS': '/dashboard/distribution/sas',
      'SNAMS': '/dashboard/distribution/snams',
      'SED': '/dashboard/distribution/sed',
      'SHTM': '/dashboard/distribution/shtm',
      'CCJEF': '/dashboard/distribution/ccjef'
    };

    if (routes[label]) {
      this.router.navigateByUrl(routes[label]);
    }
  }

  destroyCharts() {
    if (this.chartDepartment) {
      this.chartDepartment.destroy();
      this.chartDepartment = null;
    }
    if (this.chartEmployment) {
      this.chartEmployment.destroy();
      this.chartEmployment = null;
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
