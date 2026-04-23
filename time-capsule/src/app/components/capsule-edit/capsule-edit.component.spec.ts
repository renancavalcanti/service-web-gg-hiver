import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapsuleEditComponent } from './capsule-edit.component';

describe('CapsuleEditComponent', () => {
  let component: CapsuleEditComponent;
  let fixture: ComponentFixture<CapsuleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapsuleEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapsuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
