import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MenuComponent } from './menu/menu.component';
import {AdminRoutingModule} from './admin-routing.module';
import { ItemComponent } from './item/item.component';
import { WorldComponent } from './world/world.component';


@NgModule({
  declarations: [
    MenuComponent,
    ItemComponent,
    WorldComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
