import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {WorldComponent} from "./world/world.component";

const routes: Routes = [
  {
    path: 'menu', component: MenuComponent, children: [
      {path: 'menu', component: WorldComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
