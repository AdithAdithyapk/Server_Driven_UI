import { Component, OnInit } from '@angular/core';
import { ConfigserviceService } from '../../services/configservice.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [``]
})
export class FooterComponent implements OnInit {
  footerText = 'It`s Server Driven UI';

  constructor(private configService: ConfigserviceService) {}

  ngOnInit() {
    this.configService.getUIConfig('components', 'footer').subscribe(
      (data) => {
        this.footerText = data.text || '';
      },
      (error) => console.error('Error loading footer data:', error)
    );
  }
}
