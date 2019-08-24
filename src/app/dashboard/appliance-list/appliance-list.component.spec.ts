import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplianceListComponent } from './appliance-list.component';

describe('ApplianceListComponent', () => {
  let component: ApplianceListComponent;
  let fixture: ComponentFixture<ApplianceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplianceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplianceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
