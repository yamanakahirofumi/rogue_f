import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateUserComponent} from "./fields/player/create-user/create-user.component";
import {DungeonComponent} from "./fields/dungeon/dungeon.component";

const routes: Routes = [
  {path: 'user/create', component: CreateUserComponent},
  {path: 'play', component: DungeonComponent},
  {path: 'admin', pathMatch: 'full', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  {path: '', redirectTo: 'user/create', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
