import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SummaryListComponentPageRoutingModule } from './summary-list-component-routing.module';

import { SummaryListComponent } from './summary-list-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryListComponentPageRoutingModule,
  ],
  declarations: [SummaryListComponent],
})
export class SummaryListComponentPageModule {}
