
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicComponent } from './components/dynamic/dynamic.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ConfigserviceService } from './services/configservice.service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


export function initializeApp(configService: ConfigserviceService) {
  return () => configService.loadInitialRoutes(); 
}


@NgModule({
  declarations: [
    AppComponent,
    DynamicComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
     FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxJsonViewerModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [ConfigserviceService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
