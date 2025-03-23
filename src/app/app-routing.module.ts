import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { DynamicComponent } from './components/dynamic/dynamic.component';
import { ConfigserviceService } from './services/configservice.service';

const defaultRoutes: Routes = [
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(defaultRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private configService: ConfigserviceService, private router: Router) {
    this.loadDynamicRoutes();
  }

  loadDynamicRoutes() {
    this.configService.getUIConfig('components', 'sidebar').subscribe((data) => {
      if (data.menuItems) {
        const dynamicRoutes: Routes = data.menuItems.map((item: { action: string; }) => ({
          path: item.action.replace('/', ''), 
          component: DynamicComponent
        }));

        this.router.resetConfig([...dynamicRoutes, ...defaultRoutes]);
      }
    }, error => console.error('Error loading sidebar routes:', error));
  }
}
