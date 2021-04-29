import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DungeonComponent } from './fields/dungeon/dungeon.component';
import {AppRouteModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { CreateUserComponent } from './fields/player/create-user/create-user.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AdminModule} from './admin/admin.module';
import { MessageComponent } from './fields/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    DungeonComponent,
    CreateUserComponent,
    MessageComponent
  ],
    imports: [
        AdminModule,
        BrowserModule,
        AppRouteModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
