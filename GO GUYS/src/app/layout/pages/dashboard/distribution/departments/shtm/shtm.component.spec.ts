import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShtmComponent } from './shtm.component';

describe('ShtmComponent', () => {
  let component: ShtmComponent;
  let fixture: ComponentFixture<ShtmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShtmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
