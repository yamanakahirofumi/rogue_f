import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DungeonComponent} from './fields/dungeon/dungeon.component';
import {CreateUserComponent} from './fields/player/create-user/create-user.component';

const appRoutes: Routes = [
  {path: '', component: CreateUserComponent},
  {path: 'play', component: DungeonComponent},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRouteModule {
}
