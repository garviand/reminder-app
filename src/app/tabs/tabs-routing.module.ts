import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/create-task',
        pathMatch: 'full'
      },
      {
        path: 'create-task',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../create-task/create-task.module').then(m => m.CreateTaskPageModule)
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
