import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbaComponent } from './sba.component';

describe('SbaComponent', () => {
  let component: SbaComponent;
  let fixture: ComponentFixture<SbaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SbaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
