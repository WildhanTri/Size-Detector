import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements AfterViewInit {

  listSatuan = new FormControl();
  deskripsiItem = new FormControl();

  satuan: Satuan[] = [
    {
      name: "Gram",
      code: "GR",
      regex: "(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?gram|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? gram|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?grm|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? grm|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?gr|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? gr|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?g|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? g",
      toggle: true
    },
    {
      name: "Mililiter",
      code: "ML",
      regex: "(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?mili|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? mili|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?mil|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? mil|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?ml|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? ml",
      toggle: false
    },
  ]

  // satuan: Satuan[] = [
  //   {
  //     name: "Gram",
  //     code: "GR",
  //     regex: "(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?g(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? g(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?gr(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? gr(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?gram(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? gram(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?grm(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? grm(?:$|\\W)",
  //     toggle: true
  //   },
  //   {
  //     name: "Mililiter",
  //     code: "ML",
  //     regex: "(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?ml(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? ml(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?mili(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? mili(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?mil(?:$|\\W)|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? mil(?:$|\\W)",
  //     toggle: false
  //   },
  // ]

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  file: File
  arrayBuffer: any

  headers: string[] = []
  rawdata: any[] = []
  selectedColumn = ""

  addFile(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });


      var header = []

      var i = 0;
      for (let a of arraylist) {
        if (i == 0) {
          Object.keys(a).map((k) => {
            header.push(k)
          })
          this.headers = header
        }
        i++
        this.rawdata.push(a)
      }
      console.log(this.headers)

    }
  }

  detectSatuan() {

    // var item = "NUTRIBABY ROYAL 2 800 Gr"
    // var sizeSatuan = item.toLowerCase().match(new RegExp("(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?gram|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? gram|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?grm|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? grm|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?gr|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? gr|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)?g|(?:^|\\W)[0-9]+(\\.[0-9][0-9]?)? g", "g"))
    // var size = sizeSatuan[0].trim().match(new RegExp("[0-9]+(\\.[0-9][0-9]?)|[0-9]+", "g"))[0]
    // var satuan = sizeSatuan[0].replace(new RegExp("[0-9]+(\\.[0-9][0-9]?)|[0-9]+", "g"),"").trim()
    // console.log(size)
    // console.log(satuan)

    for (let rd of this.rawdata) {
      rd["size"] = ""
      rd["satuan"] = ""
      for (let s of this.satuan) {
        if (s.toggle && (rd["size"] == "" || rd["satuan"] == "") ) {
          var sizeSatuan = rd[this.selectedColumn].toLowerCase().match(new RegExp(s.regex, "g"))
          var size = ""
          var satuan = ""
          if (sizeSatuan != null && sizeSatuan.length > 0) {
            size = sizeSatuan[0].trim().match(new RegExp("[0-9]+(\\.[0-9][0-9]?)|[0-9]+", "g"))[0]
            satuan = sizeSatuan[0].replace(new RegExp("[0-9]+(\\.[0-9][0-9]?)|[0-9]+", "g"),"").trim()
          }

          rd["size"] = size
          rd["satuan"] = satuan
        }
      }
    }

    this.headers.push("size")
    this.headers.push("satuan")

    this.displayedColumns = this.headers
    this.dataSource = new MatTableDataSource<any>(this.rawdata);
    this.dataSource.paginator = this.paginator;
    console.log(this.rawdata)
  }

  
  generateJsonToExcel() {
    var filename = "Satuan Detector Created BY WILDHAN TRIHERLIAN SAPUTRAWAN.xlsx"
    const workBook = XLSX.utils.book_new(); // create a new blank book

    const workSheet1 = XLSX.utils.json_to_sheet(this.rawdata);
    XLSX.utils.book_append_sheet(workBook, workSheet1, 'Data'); // add the worksheet to the book

    XLSX.writeFile(workBook, filename); // initiate a file download in browser
  }
}


export interface Satuan {
  name: string;
  code: string;
  regex: string;
  toggle: boolean;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];