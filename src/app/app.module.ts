import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MessageComponent} from './fields/message/message.component';
import {DungeonComponent} from './fields/dungeon/dungeon.component';
import {StatusBarComponent} from './fields/status-bar/status-bar.component';
import {CreateUserComponent} from './fields/player/create-user/create-user.component';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({ declarations: [
        AppComponent,
        MessageComponent,
        DungeonComponent,
        StatusBarComponent,
        CreateUserComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
}
