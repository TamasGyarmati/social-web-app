import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostDialog } from './edit-post-dialog';

describe('EditPostDialog', () => {
  let component: EditPostDialog;
  let fixture: ComponentFixture<EditPostDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
