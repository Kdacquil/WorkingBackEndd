import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedComponent } from './sed.component';

describe('SedComponent', () => {
  let component: SedComponent;
  let fixture: ComponentFixture<SedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
