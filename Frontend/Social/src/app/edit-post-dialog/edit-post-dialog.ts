import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { getAllPost } from '../_models/getAllPost';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPostService } from '../_services/edit-post.service';

interface EditPostDialogData {
  post: getAllPost;
}

@Component({
  selector: 'app-edit-post-dialog',
  imports: [MATERIAL_IMPORTS, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-post-dialog.html',
  styleUrl: './edit-post-dialog.scss',
})
export class EditPostDialog implements OnInit {
  public selectedFileName: string = '';

  public editPostForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    image: new FormControl<File | null>(null),
  });

  public isLoading = signal<boolean>(true);

  public postData = inject<EditPostDialogData>(MAT_DIALOG_DATA);
  public oldPostData: EditPostDialogData = this.postData;
  private dialogRef = inject(MatDialogRef<EditPostDialog>);
  private matBar = inject(MatSnackBar);
  private editPostService: EditPostService = inject(EditPostService);

  ngOnInit(): void {
    this.editPostForm.patchValue({
      title: this.postData.post.title,
      description: this.postData.post.description,
    });

    this.isLoading.set(false);
  }

  public updatePost(): void {
    if (
      this.editPostForm.controls.title.value === this.oldPostData.post.title &&
      this.editPostForm.controls.description.value === this.oldPostData.post.description &&
      this.editPostForm.controls.image.value === null
    ) {
      this.closeDialog(false);
      return;
    }

    if (this.editPostForm.invalid) {
      this.editPostForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formData = new FormData();

    formData.append('Title', this.editPostForm.controls.title.value);
    formData.append('Description', this.editPostForm.controls.description.value);

    const image = this.editPostForm.controls.image.value;

    if (image) {
      formData.append('Image', image);
    }

    this.editPostService.updatePost(this.postData.post.id, formData).subscribe({
      next: (success) => {
        console.log('::SUCCESS::', success);
        console.log(this.editPostForm.controls.image.value);

        this.matBar.open('Successfully updated the post', 'Close', { duration: 3000 });

        this.closeDialog(true);
      },

      error: (error) => {
        console.log('::ERROR::', error);

        this.isLoading.set(false);
      },

      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.editPostForm.patchValue({
        image: input.files[0],
      });
    }
  }

  public onDescriptionEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      event.preventDefault();
      this.updatePost();
    }
  }

  public closeDialog(updated: boolean = true): void {
    this.dialogRef.close(updated);
  }
}
