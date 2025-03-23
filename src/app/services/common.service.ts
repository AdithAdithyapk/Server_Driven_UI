import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    options: {
      body?: any,
      params?: { [key: string]: any },
      headers?: { [key: string]: any }
    } = {}
  ): Observable<any> {
    const url = `${this.baseUrl}${endpoint}`;

    const httpParams = new HttpParams({
      fromObject: options.params || {}
    });

    const httpHeaders = new HttpHeaders(options.headers || {});

    return this.http.request(method, url, {
      body: options.body || null,
      params: httpParams,
      headers: httpHeaders,
    });
  }
}


// 📌 Make a GET request with query params:
// this.commonService.request('GET', '/users', {
//   params: { role: 'admin', active: true }
// }).subscribe(res => {
//   console.log(res);
// });


// Make a POST request with payload:
// this.commonService.request('POST', '/login', {
//   body: { username: 'test', password: '1234' }
// }).subscribe(res => {
//   console.log(res);
// });


// Make a DELETE request with custom headers:
// this.commonService.request('DELETE', '/user/123', {
//   headers: { Authorization: 'Bearer your_token' }
// }).subscribe(res => {
//   console.log(res);
// });




// import { Component, OnInit } from '@angular/core';
// import { CommonService } from '../services/common-service'; // adjust the path as needed

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
// })
// export class HomeComponent implements OnInit {
//   constructor(private commonService: CommonService) {}

//   ngOnInit(): void {
//     this.fetchData();
//   }

//   fetchData() {
//     this.commonService.request('GET', '/users', {
//       params: { active: true }
//     }).subscribe({
//       next: (response) => {
//         console.log('Success:', response);
//       },
//       error: (error) => {
//         console.error('Error:', error);
//       }
//     });
//   }
// }


// this.commonService.request('GET', '/products', {
//   params: { category: 'kids' }
// }).subscribe(res => console.log(res));


// /this.commonService.request('POST', '/login', {
//   body: { username: 'admin', password: '1234' }
// }).subscribe(res => console.log(res));


// this.commonService.request('PUT', '/user/123', {
//   body: { name: 'Updated Name' }
// }).subscribe(res => console.log(res));


// this.commonService.request('DELETE', '/user/123').subscribe(res => console.log(res));
