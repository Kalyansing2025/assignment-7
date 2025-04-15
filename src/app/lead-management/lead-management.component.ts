import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { GridModule, DataBindingDirective, ExcelModule, PDFModule, CreateFormGroup, CreateFormGroupArgs, KENDO_GRID } from '@progress/kendo-angular-grid';
import { DropDownListModule, KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule, RatingModule, InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule, KENDO_BUTTONGROUP, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_TOOLBAR, ToolBarModule } from '@progress/kendo-angular-toolbar';


import { SparklineModule, ChartsModule } from '@progress/kendo-angular-charts';
import { process } from '@progress/kendo-data-query';
import { SVGIcon, fileExcelIcon, filePdfIcon } from '@progress/kendo-svg-icons';
import { KENDO_LABEL, LabelModule } from '@progress/kendo-angular-label';
import { employees } from './emp';
import { images } from './images';
import { products } from '../product';
import { KENDO_GRIDLAYOUT } from '@progress/kendo-angular-layout';
import { KENDO_APPBAR } from '@progress/kendo-angular-navigation';
// import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

@Component({
  standalone: true, 
  selector: "app-lead-management",  
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    ToolBarModule,
    InputsModule,
    ButtonsModule,
    DropDownListModule,
    ExcelModule,
    PDFModule,
    TextBoxModule,
    RatingModule,
    KENDO_DROPDOWNBUTTON,
    KENDO_DROPDOWNLIST,
    KENDO_BUTTONGROUP,
    KENDO_GRID,
    KENDO_GRIDLAYOUT,
    KENDO_TOOLBAR,
    KENDO_APPBAR,
    KENDO_LABEL,
    LabelModule
  ],
})
export class LeadManagementComponent {
// toolbar


leadOptions = [
  { text: 'Intl Leads', value: 'intl' },
  { text: 'Non-Intl Leads', value: 'non-intl' }
];

searchPreferences = [
  { text: 'My Saved Filter 1', value: 'filter1' },
  { text: 'My Saved Filter 2', value: 'filter2' }
];

selectedLead: string | null = null;
selectedPreference: string | null = null;
searchQuery = '';
leadTypeToggle = 'intl'; // default selected toggle

clearFilters() {
  this.selectedLead = null;
  this.selectedPreference = null;
  this.searchQuery = '';
}

bulkEdit() {
  console.log('Bulk edit clicked');
}

savePreferences() {
  console.log('Save preferences clicked');
}



onfilter(){
  console.log("Filter works");
  
}



//table
public gridData: any[] = [
  {
    RecordId: 101,
    LastName: 'Doe',
    FirstName: 'John',
    PrimaryEmailAddress: 'john.doe@example.com',
    PrimaryPhoneType: 'Mobile',
    LMPLeadId: 'LMP12345',
    AppoinmentType: 'Consultation',
    AssignedDate: '2025-04-01',
    SalesRep: 'Alice Smith',
    Coordinator: 'Bob Johnson',
    SyncToMobile: true,
    EffectiveDate: '2025-04-10',
  },
  {
    RecordId: 102,
    LastName: 'Smith',
    FirstName: 'Jane',
    PrimaryEmailAddress: 'jane.smith@example.com',
    PrimaryPhoneType: 'Work',
    LMPLeadId: 'LMP54321',
    AppoinmentType: 'Demo',
    AssignedDate: '2025-04-02',
    SalesRep: 'Charlie Brown',
    Coordinator: 'Dana White',
    SyncToMobile: false,
    EffectiveDate: '2025-04-11',
  },
];


  public formGroup!: FormGroup;
  private editedRowIndex: number | null = null;
  private nextProductID = 3;

  constructor(private fb: FormBuilder) {}

  public createFormGroup = (args: { dataItem: any; isNew: boolean }): FormGroup => {

    const item = args.isNew
      ? {
          ProductID: this.nextProductID,
          ProductName: '',
          UnitPrice: 0,
          UnitsInStock: 0,
          Discontinued: false,
        }
      : args.dataItem;

    return this.fb.group({
      RecordId: new FormControl(item.RecordId),
    LastName: new FormControl(item.LastName, Validators.required),
    FirstName: new FormControl(item.FirstName, Validators.required),
    PrimaryEmailAddress: new FormControl(item.PrimaryEmailAddress, [
      Validators.required,
      Validators.email
    ]),
    PrimaryPhoneType: new FormControl(item.PrimaryPhoneType),
    LMPLeadId: new FormControl(item.LMPLeadId),
    AppoinmentType: new FormControl(item.AppoinmentType),
    AssignedDate: new FormControl(item.AssignedDate),
    SalesRep: new FormControl(item.SalesRep, Validators.required),
    Coordinator: new FormControl(item.Coordinator),
    SyncToMobile: new FormControl(item.SyncToMobile),
    EffectiveDate: new FormControl(item.EffectiveDate)
    });
  };

  public addHandler({ sender }: any): void {
    this.closeEditor(sender);
    this.formGroup = this.createFormGroup({ dataItem: {}, isNew: true });
    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }: any): void {
    this.closeEditor(sender);
    this.formGroup = this.createFormGroup({ dataItem, isNew: false });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }: any): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: any): void {
    const product = formGroup.value;

    if (isNew) {
      this.gridData = [
        ...this.gridData,
        { ...product, ProductID: this.nextProductID++ },
      ];
    } else {
      this.gridData[rowIndex] = product;
      this.gridData = [...this.gridData]; // Force refresh
    }

    this.closeEditor(sender);
  }

  public removeHandler({ dataItem }: any): void {
    this.gridData = this.gridData.filter(p => p.ProductID !== dataItem.ProductID);
  }

  private closeEditor(grid: any, rowIndex: number = this.editedRowIndex!): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = null;
  }
  onActionSelect(action: string, dataItem: any) {
    console.log(`Action '${action}' selected for`, dataItem);
  }
  
  onActionMenuClick(dataItem: any) {
    console.log('Action menu clicked for', dataItem);
  }
  
}