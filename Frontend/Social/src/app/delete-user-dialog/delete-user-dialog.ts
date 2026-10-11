import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../_shared/material';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user-dialog',
  imports: [MATERIAL_IMPORTS, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './delete-user-dialog.html',
  styleUrl: './delete-user-dialog.scss',
})
export class DeleteUserDialog {}
