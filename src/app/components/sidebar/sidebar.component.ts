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
        this.menuItems = data.menuItems || [];
      },
      (error) => console.error('Error loading sidebar data:', error)
    );
  }
}
