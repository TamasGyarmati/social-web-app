import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowDialog } from './follow-dialog';

describe('FollowDialog', () => {
  let component: FollowDialog;
  let fixture: ComponentFixture<FollowDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
