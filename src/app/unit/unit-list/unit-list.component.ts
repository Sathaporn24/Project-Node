import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { AccountService } from '../../shared/services/account.service';
import Swal from 'sweetalert2';

import { UnitService, ItemsUnit } from '../../shared/services/unit.service';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    TooltipModule,
    CheckboxModule,
    InputGroupModule
  ],
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UnitListComponent implements OnInit {
  units: ItemsUnit[] = [];
  isSeller = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private unitService: UnitService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isSeller = this.accountService.isUserInRole('Seller');
    await this.getUnit();
  }

  async getUnit(){
    this.unitService.getUnitAll().subscribe({
      next: (res: any) => {
       this.units = res.data;
       this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    });
  }

  async addUnit(){
    const { value: userInput } = await Swal.fire({
      title: 'Unit name',
      input: 'text',
      inputLabel: 'Name Unit',
      inputPlaceholder: 'Enter your Unit here',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        return null;
      }
    });

    if(userInput){
      this.unitService.addUnit(userInput).subscribe({
        next: async (newUnit) => {
          await this.getUnit();
          Swal.fire('Success!', 'Unit added successfully!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error!', 'Failed to add Unit. Please try again.', 'error');
        }
      });
    }
  }

  editUnit(Unit: ItemsUnit) {
    Swal.fire({
      title: 'Edit Unit Name',
      input: 'text',
      inputLabel: 'Update Unit Name',
      inputValue: Unit.unName, 
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.unitService.editUnit(Unit.id, result.value).subscribe({
          next: async () => {
            await this.getUnit();
            Swal.fire('Success!', 'Unit update successfully!', 'success');
          },
          error: (err: HttpErrorResponse) => {
            Swal.fire('Error!', 'Failed to add Unit. Please try again.', 'error');
          }
        });
      }
    });
  }

  deleteUnit(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.unitService.delUnit(id).subscribe({
          next: async () => {
            await this.getUnit();
            Swal.fire('Deleted!', 'Your Unit has been deleted.', 'success');
          },
          error: (err: HttpErrorResponse) => {
            Swal.fire('Error!', 'Failed to add Unit. Please try again.', 'error');
          }
        });
      }
    });
  }


}
