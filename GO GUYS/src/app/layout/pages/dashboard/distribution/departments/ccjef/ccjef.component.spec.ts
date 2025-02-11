import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcjefComponent } from './ccjef.component';

describe('CcjefComponent', () => {
  let component: CcjefComponent;
  let fixture: ComponentFixture<CcjefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CcjefComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcjefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
