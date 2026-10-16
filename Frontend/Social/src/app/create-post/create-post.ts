import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { CommonModule, Location } from '@angular/common';
import { inject } from '@angular/core';
import { signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePostService } from '../_services/create-post.service';

@Component({
  selector: 'app-create-post',
  imports: [MATERIAL_IMPORTS, CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost implements OnInit {
  public selectedFileName: string = '';

  public isLoading = signal<boolean>(true);

  public postForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    image: new FormControl<File | null>(null, {}),
  });

  private location: Location = inject(Location);
  private createPostService: CreatePostService = inject(CreatePostService);
  private router: Router = inject(Router);
  private matBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.isLoading.set(false);
  }

  public createPost(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formData = new FormData();

    formData.append('Title', this.postForm.controls.title.value);
    formData.append('Description', this.postForm.controls.description.value);

    const image = this.postForm.controls.image.value;

    if (image) {
      formData.append('Image', image);
    }

    this.createPostService.createPostRequest(formData).subscribe({
      next: () => {
        this.matBar.open('Post created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        console.error('::ERROR::', error);
        this.matBar.open('Failed to create post', 'Close', {
          duration: 3000,
        });
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
      this.postForm.patchValue({
        image: input.files[0],
      });
    }
  }

  public onDescriptionEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      event.preventDefault();
      this.createPost();
    }
  }

  public goBack(): void {
    this.location.back();
  }
}
