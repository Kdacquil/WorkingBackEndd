import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnamsComponent } from './snams.component';

describe('SnamsComponent', () => {
  let component: SnamsComponent;
  let fixture: ComponentFixture<SnamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
