import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})
export class DynamicComponent implements OnInit {
  @Input() config: any;
  formData: any = {};
  data: any = {}; // ✅ Declare the 'data' property

  constructor(private http: HttpClient, private router: Router,private commonsrc : CommonService) {}

  ngOnInit(): void {

    console.log("*************UI Config**********************",this.config)
    // this.http.get('http://localhost:4000/api/dashboard-stats').subscribe((res: any) => {
    //   this.data = res;
    // });

    this.getDashBoardData();
  }


  getDashBoardData()
  {
      this.commonsrc.request("GET","api/dashboard-stats").subscribe((res: any) => {
        this.data = res;
      });
  }

  handleAction(action: any) {
    if (action.type === 'api') {
      const postData: any = {};
      action.fields?.forEach((field: string) => {
        postData[field] = this.formData[field];
      });
  
      this.http.request(action.method, `http://localhost:4000${action.url}`, {
        body: postData
      }).subscribe((res: any) => {
        this.resolveAction(action.onSuccess, res);
      }, err => {
        this.resolveAction(action.onError, err.error);
      });
    }
  }
  
  resolveAction(responseAction: any, resData: any) {
    if (!responseAction) return;
  
    switch (responseAction.type) {
      case 'navigate':
        this.router.navigate([responseAction.route]);
        break;
      case 'alert':
        alert(resData[responseAction.messageField] || 'Unknown error');
        break;
      case 'reload':
        window.location.reload();
        break;
    }
  }

  resolveText(text: string): string {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/{{(.*?)}}/g, (_match, path) => {
      try {
        return path.trim().split('.').reduce((acc: { [x: string]: any; }, key: string | number) => acc?.[key], this) || '';
      } catch (e) {
        return '';
      }
    });
  }
}
