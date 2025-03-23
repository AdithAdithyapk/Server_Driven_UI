import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { ConfigserviceService } from './services/configservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [``]
})
export class AppComponent implements OnInit {
  uiConfig: any;
  showHeader = false;
  showSidebar = false;
  showFooter = false;

  constructor(private configService: ConfigserviceService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadUIConfig();
        
      }
    });
    this.loadUIConfig();
  }

  loadUIConfig() {
    let currentPath = window.location.pathname.replace(/^\/+/, '');
    if (!currentPath) {
      currentPath = 'login';
    }

    const page = currentPath;

    this.configService.getUIConfig('pages', page).subscribe(
      (data) => {
        console.log(data)
        this.uiConfig = data;
        this.showHeader = (data.type!= 'page');
        this.showSidebar = (data.type!= 'page');
        this.showFooter = (data.type!= 'page');
      },
      (error) => console.error('Error loading UI config:', error)
    );
  }
}
