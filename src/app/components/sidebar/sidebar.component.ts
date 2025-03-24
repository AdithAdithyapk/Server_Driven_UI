import { Component, OnInit } from '@angular/core';
import { ConfigserviceService } from '../../services/configservice.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(private configService: ConfigserviceService) {}

  ngOnInit() {
    this.configService.getUIConfig('components', 'sidebar').subscribe(
      (data) => {
        this.menuItems = data.menuItems.filter((item:any) => item.admin) || [];
        if(sessionStorage.getItem("admin") == "no")
        {
          this.menuItems = data.menuItems.filter((item:any) => item.user);
        }
       
      },
      (error) => console.error('Error loading sidebar data:', error)
    );
  }

  toggleSubmenu(item: any) {
    if (item.submenuItems) {
      item.submenuVisible = !item.submenuVisible;
    }
  }
}
