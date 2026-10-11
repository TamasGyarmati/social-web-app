import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHandling } from './user-handling';

describe('UserHandling', () => {
  let component: UserHandling;
  let fixture: ComponentFixture<UserHandling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHandling],
    }).compileComponents();

    fixture = TestBed.createComponent(UserHandling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
