import { Component, OnInit } from '@angular/core';
import { AdminService } from './services/api/admin.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from './confirmation-popup.component';
import { Title } from '@angular/platform-browser';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  isLoading: boolean = true;
  accounts: any[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private titleService: Title,
    private navigationService: NavigationService)
  {
    this.titleService.setTitle("Admin page");
  }

  ngOnInit(): void {
    this.loadStatistic();
  }

  private loadStatistic(): void {
    this.adminService.getStatistic().subscribe(data =>
      {
        this.accounts = data;
        this.isLoading = false;
      }
    );
  }

  deleteAccount(username: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { message: 'Are you sure you want to delete the account?' };
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.adminService.deleteAccount(username).subscribe(() =>
          {
            this.loadStatistic();
          }
        );
      }
    });
  }

  signOut(): void {
    this.navigationService.signOut();
  }
}
