import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicComponent } from '../components/dynamic/dynamic.component';
import { Router, Routes } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigserviceService {
  private apiUrl = 'http://localhost:4000/api/json';

  constructor(private http: HttpClient, private router: Router) { }

  getUIConfig(category: string, page: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${category}/${page}`);
  }

  // authenticateUser(data: any): Observable<any> {
  //   return this.http.post('http://localhost:4000/authenticate', data);
  // }

  createJsonFile(title: string, content: any, addToSidebar: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, { title, content, addToSidebar });
  }

  loadInitialRoutes(): Promise<any> {
    return this.getUIConfig('components', 'sidebar').toPromise().then((data) => {
      if (data.menuItems) {
        const dynamicRoutes: Routes = data.menuItems.map((item: { action: string; }) => ({
          path: item.action.replace('/', ''),

          component: DynamicComponent
        }));

        this.router.resetConfig([...dynamicRoutes, { path: '**', redirectTo: '', pathMatch: 'full' }]);
      }
    }).catch(error => console.error('Error loading initial routes:', error));
  }

  getJsonFileList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list`);
  }

  loadJsonFile(filename: string): Observable<any> {
    return this.http.get<any>(`http://localhost:4000/api/load/${filename}`);
  }

  saveJsonFile(filename: string, content: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save/${filename}`, content);
  }

}
