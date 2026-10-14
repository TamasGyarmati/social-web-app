import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../_shared/material';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-post-dialog',
  imports: [MatDialogActions, MatDialogContent, MatDialogClose, MATERIAL_IMPORTS],
  templateUrl: './delete-post-dialog.html',
  styleUrl: './delete-post-dialog.scss',
})
export class DeletePostDialog {
  readonly dialogRef = inject(MatDialogRef<DeletePostDialog>);
}
