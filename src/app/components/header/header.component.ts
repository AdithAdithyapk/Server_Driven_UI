import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigserviceService } from '../../services/configservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [``]
})
export class HeaderComponent implements OnInit {
  title = 'Loading...';

  constructor(private configService: ConfigserviceService, private router: Router) {}

  ngOnInit() {
    this.configService.getUIConfig('components', 'header').subscribe(
      (data) => {
        this.title = data.title || 'My Application';
      },
      (error) => console.error('Error loading header data:', error)
    );
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
