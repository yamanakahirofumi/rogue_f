import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {ItemComponent} from './item/item.component';
import {MenuComponent} from './menu/menu.component';
import {WorldComponent} from './world/world.component';


@NgModule({
  declarations: [
    ItemComponent,
    MenuComponent,
    WorldComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule {
}
