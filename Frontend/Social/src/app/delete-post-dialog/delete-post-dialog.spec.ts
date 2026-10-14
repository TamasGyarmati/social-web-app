import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePostDialog } from './delete-post-dialog';

describe('DeletePostDialog', () => {
  let component: DeletePostDialog;
  let fixture: ComponentFixture<DeletePostDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePostDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePostDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
