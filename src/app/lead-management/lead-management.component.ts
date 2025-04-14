import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridModule, DataBindingDirective } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { process } from "@progress/kendo-data-query";
import { SVGIcon, fileExcelIcon, filePdfIcon } from "@progress/kendo-svg-icons";
import { employees } from "./emp";
import { images } from "./images";





import {
  KENDO_GRID,
  KENDO_GRID_EXCEL_EXPORT,
  KENDO_GRID_PDF_EXPORT,
} from "@progress/kendo-angular-grid";


@Component({
  selector: "app-lead-management",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GridModule, // ✅ This includes all grid stuff including toolbar buttons
    DropDownListModule,
    TextBoxModule,
    ButtonsModule,
    PDFExportModule,
    ExcelExportModule
  ],    
  
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.css'],


})
export class LeadManagementComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;

  public gridData: unknown[] = employees;
  public gridView: unknown[] = [];

  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  
  public leadType: 'intl' | 'non-intl' = 'non-intl';

  ngOnInit(): void {
    this.gridView = this.gridData;
  }

  public setLeadType(type: 'intl' | 'non-intl'): void {
    this.leadType = type;

    
  }

  public actionItems: Array<{ text: string }> = [
    { text: "View" },
    { text: "Edit" },
    { text: "Delete" },
  ];
  
  viewItem(item: any) {
    console.log("Viewing", item);
  }
  

  public onFilter(value: Event): void {
    const inputValue = (value.target as HTMLInputElement).value;
  
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          { field: "first_name", operator: "contains", value: inputValue },
          { field: "last_name", operator: "contains", value: inputValue },
          { field: "primary_email", operator: "contains", value: inputValue },
          { field: "primary_phone", operator: "contains", value: inputValue },
          { field: "appointment_type", operator: "contains", value: inputValue },
        ],
      },
    }).data;
  
    this.dataBinding.skip = 0;
  }
  

  public photoURL(dataItem: { img_id: string; gender: string }): string {
    const code: string = dataItem.img_id + dataItem.gender;
    const image: { [Key: string]: string } = images;

    return image[code];
  }

  public flagURL(dataItem: { country: string }): string {
    const code: string = dataItem.country;
    const image: { [Key: string]: string } = images;

    return image[code];
  }
  // For dropdowns and search
public leadTypes: string[] = ['Hot', 'Warm', 'Cold'];
public selectedLeadType: string = 'Hot';

public preferences: string[] = ['Preference A', 'Preference B'];
public selectedPreference: string = '';

public searchKeyword: string = '';

// For toggle buttons
public intlFilter: 'Intl' | 'Non-Intl' = 'Non-Intl';

// Called on clicking Search
public onSearch(): void {
  console.log('Searching for:', this.searchKeyword);
  // Add filtering logic here if needed
}

// Called on clicking Clear Filters
public onClearFilters(): void {
  this.selectedLeadType = '';
  this.selectedPreference = '';
  this.searchKeyword = '';
  this.intlFilter = 'Non-Intl';
}

}

 