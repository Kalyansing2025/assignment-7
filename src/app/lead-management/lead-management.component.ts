import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


import {
  GridComponent,
  GridModule,
  ExcelModule,
  PDFModule,
  CreateFormGroupArgs
} from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule, RatingModule, InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { SparklineModule, ChartsModule } from '@progress/kendo-angular-charts';
import { KENDO_LABEL, LabelModule } from '@progress/kendo-angular-label';
import { ExcelExportComponent, ExcelExportModule } from '@progress/kendo-angular-excel-export';

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
    LabelModule,
    ExcelExportModule,
  ],
})
// Class 
export class LeadManagementComponent implements OnInit {
  @ViewChild('grid') grid!: GridComponent;
  @ViewChild('excelexport', { static: true }) excelexport!: ExcelExportComponent;
  gridData: any[] = [];
  originalGridData: any[] = [];

  formGroup!: FormGroup;
  editedRowIndex: number | null = null;

  // Toolbar controls
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
  leadTypeToggle = 'intl';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/leads').subscribe(data => {
      this.gridData = data.map(item => ({
        ...item,
        RecordId: item.id
      }));
      this.originalGridData = [...this.gridData];
    });
  }

  // Excel export
  exportToExcel(): void {
    if (this.excelexport) {
      this.excelexport.save(); 
    }
  }

  //Create New Data
  createFormGroup = (args: { dataItem: any; isNew: boolean }): FormGroup => {
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
  // For Add Data
  addHandler({ sender }: any): void {
    this.closeEditor(sender);
    this.formGroup = this.createFormGroup({ dataItem: {}, isNew: true });
    sender.addRow(this.formGroup);
  }
// Edit Data
  editHandler({ sender, rowIndex, dataItem }: any): void {
    this.closeEditor(sender);
    this.formGroup = this.createFormGroup({ dataItem, isNew: false });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }
// Camcel Create Date
  cancelHandler({ sender, rowIndex }: any): void {
    this.closeEditor(sender, rowIndex);
  }
// For Save 
  saveHandler({ sender, rowIndex, formGroup, isNew }: any): void {
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

  onExcelExport(e: any): void {
    e.workbook.fileName = 'Leads.xlsx'; 
  }
// For Remove Data
  removeHandler({ dataItem }: any): void {
    this.http.delete(`http://localhost:3000/leads/${dataItem.RecordId}`).subscribe(() => {
      this.gridData = this.gridData.filter(p => p.RecordId !== dataItem.RecordId);
    });
  }
// For Filter Data
  clearFilters(): void {
    this.selectedLead = null;
    this.selectedPreference = null;
    this.searchQuery = '';
  }

  bulkEdit(): void {
    console.log('Bulk edit clicked');
  }

  savePreferences(): void {
    console.log('Save preferences clicked');
  }

  onfilter(): void {
    const query = this.searchQuery.toLowerCase();
    this.gridData = this.originalGridData.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(query)
      )
    );
  }

  toggleDarkMode(event: Event): void {
    const isDarkMode = (event.target as HTMLInputElement).checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
  }

  addNewRowFromToolbar(): void {
    const newItem = {
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
    };

    this.formGroup = this.createFormGroup({ dataItem: newItem, isNew: true });

    if (this.grid) {
      this.grid.addRow(this.formGroup);
    } else {
      console.warn("Grid is not ready yet.");
    }
  }

  onActionChange(event: any, dataItem: any): void {
    const selectedAction = event.target.value;

    if (selectedAction === 'edit') {
        this.editHandler({ sender: this.grid, rowIndex: this.gridData.indexOf(dataItem), dataItem });
    } else if (selectedAction === 'remove') {
        this.removeHandler({ dataItem });
    }

    event.target.value = '';
  }

  private closeEditor(grid: any, rowIndex: number = this.editedRowIndex!): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = null;
  }
}
