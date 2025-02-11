import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardComponent } from './offboard.component';

describe('OffboardComponent', () => {
  let component: OffboardComponent;
  let fixture: ComponentFixture<OffboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
