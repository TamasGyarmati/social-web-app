import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { getAllPost } from '../_models/getAllPost';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { env } from '../_env/env';

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
  private http = inject(HttpClient);
  public postData = inject<EditPostDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EditPostDialog>);
  public isLoading = signal<boolean>(true);
  private matBar = inject(MatSnackBar);
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

  ngOnInit(): void {
    this.editPostForm.patchValue({
      title: this.postData.post.title,
      description: this.postData.post.description,
    });

    this.isLoading.set(false);
  }

  public updatePost(): void {
    if (this.editPostForm.invalid) {
      this.editPostForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('Title', this.editPostForm.controls.title.value);
    formData.append('Description', this.editPostForm.controls.description.value);

    const image = this.editPostForm.controls.image.value;

    if (image) {
      formData.append('Image', image);
    }

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem(env.jwtAccessToken),
    });

    this.http
      .put(`${env.postUri}/${this.postData.post.id}`, formData, { headers: headers })
      .subscribe(
        (success) => {
          console.log('::SUCCESS::', success);
          this.closeDialog(true);
        },
        (error) => {
          console.log('::ERROR::', error);
        },
      );
  }

  private closeDialog(updated: boolean = false): void {
    this.dialogRef.close(updated);
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
}
