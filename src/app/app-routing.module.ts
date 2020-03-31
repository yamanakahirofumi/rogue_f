import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DungeonComponent} from './fields/dungeon/dungeon.component';

const appRoutes: Routes = [
  { path: '', component: DungeonComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRouteModule { }



