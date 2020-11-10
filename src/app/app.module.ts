import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentComponent } from './content/content.component';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';


const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always'
};
const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    data: {
      title: "Content"
    }
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent
  ],
  imports: [
    
    RouterModule.forRoot(routes,routingConfiguration),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,

    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
