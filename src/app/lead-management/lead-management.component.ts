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
import { HttpClient } from '@angular/common/http';
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
export class LeadManagementComponent implements OnInit{

//json







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

ngOnInit(): void {
  this.http.get<any[]>('http://localhost:3000/leads').subscribe(data => {
    this.gridData = data.map(item => ({
      ...item,
      RecordId: item.id  // 👈 Map json-server `id` to `RecordId`
    }));
  });
}

public saveHandler({ sender, rowIndex, formGroup, isNew }: any): void {
  const item = formGroup.value;

  if (isNew) {
    this.http.post('http://localhost:3000/leads', item).subscribe((res: any) => {
      this.gridData = [...this.gridData, { ...res, RecordId: res.id }];
      this.closeEditor(sender);
    });
  } else {
    const id = item.RecordId;
    this.http.put(`http://localhost:3000/leads/${id}`, item).subscribe(() => {
      this.gridData[rowIndex] = { ...item, RecordId: id };
      this.gridData = [...this.gridData];
      this.closeEditor(sender);
    });
  }
}

public removeHandler({ dataItem }: any): void {
  this.http.delete(`http://localhost:3000/leads/${dataItem.RecordId}`).subscribe(() => {
    this.gridData = this.gridData.filter(p => p.RecordId !== dataItem.RecordId);
  });
}

//table Body
public gridData: any[] = [];


  public formGroup!: FormGroup;
  private editedRowIndex: number | null = null;
  private nextProductID = 3;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  public createFormGroup = (args: { dataItem: any; isNew: boolean }): FormGroup => {
    const item = args.isNew
      ? {
          RecordId: null,
          LastName: '',
          FirstName: '',
          PrimaryEmailAddress: '',
          PrimaryPhoneType: '',
          LMPLeadId: '',
          AppoinmentType: '',
          AssignedDate: '',
          SalesRep: '',
          Coordinator: '',
          SyncToMobile: false,
          EffectiveDate: '',
        }
      : args.dataItem;
  
    return this.fb.group({
      RecordId: new FormControl(item.RecordId),
      LastName: new FormControl(item.LastName, Validators.required),
      FirstName: new FormControl(item.FirstName, Validators.required),
      PrimaryEmailAddress: new FormControl(item.PrimaryEmailAddress, [Validators.required, Validators.email]),
      PrimaryPhoneType: new FormControl(item.PrimaryPhoneType),
      LMPLeadId: new FormControl(item.LMPLeadId),
      AppoinmentType: new FormControl(item.AppoinmentType),
      AssignedDate: new FormControl(item.AssignedDate),
      SalesRep: new FormControl(item.SalesRep, Validators.required),
      Coordinator: new FormControl(item.Coordinator),
      SyncToMobile: new FormControl(item.SyncToMobile),
      EffectiveDate: new FormControl(item.EffectiveDate),
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

  // public saveHandler({ sender, rowIndex, formGroup, isNew }: any): void {
  //   const product = formGroup.value;

  //   if (isNew) {
  //     this.gridData = [
  //       ...this.gridData,
  //       { ...product, ProductID: this.nextProductID++ },
  //     ];
  //   } else {
  //     this.gridData[rowIndex] = product;
  //     this.gridData = [...this.gridData]; // Force refresh
  //   }

  //   this.closeEditor(sender);
  // }

  // public removeHandler({ dataItem }: any): void {
  //   this.gridData = this.gridData.filter(p => p.ProductID !== dataItem.ProductID);
  // }

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
  
  toggleDarkMode(event: Event): void {
    const isDarkMode = (event.target as HTMLInputElement).checked;
    const body = document.body;
  
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }
  
  
  
}