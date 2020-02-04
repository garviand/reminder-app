import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs';

const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'create-task',
        loadChildren: () =>
          import('../create-task/create-task.module').then(m => m.CreateTaskPageModule)
      },
      {
        path: 'view-tasks',
        loadChildren: () =>
          import('../view-tasks/view-tasks.module').then(m => m.ViewTasksPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/app/create-task',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
