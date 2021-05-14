import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DungeonComponent} from './fields/dungeon/dungeon.component';
import {CreateUserComponent} from './fields/player/create-user/create-user.component';

const appRoutes: Routes = [
  {path: 'user/create', component: CreateUserComponent},
  {path: 'play', component: DungeonComponent},
  {path: 'admin', pathMatch: 'full', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  {path: '', redirectTo: 'user/create', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRouteModule {
}
