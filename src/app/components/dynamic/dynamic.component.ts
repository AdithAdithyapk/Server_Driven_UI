import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})
export class DynamicComponent implements OnInit, OnChanges {
  @Input() config: any;
  formData: any = {};
  data: any = {}; // ✅ Declare the 'data' property

  constructor(private http: HttpClient, private router: Router, private commonsrc: CommonService) { }
  
 

  ngOnInit(): void {
    this.tryFetching(this.config?.action);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.tryFetching(this.config?.action);
    }
  }

  tryFetching(action: any) {
    if (action?.type === 'data' && action?.method === 'GET') {
      this.fetchInitialData(action);
    }
  }

  fetchInitialData(action: any) {
    if (action.type === 'data' && action.method === 'GET') {
      const queryParams: any = {};
      action.fields?.forEach((field: string) => {
        queryParams[field] = this.formData[field];
      });

      this.http.get(`http://localhost:4000${action.url}`, { params: queryParams })
        .subscribe(
          (res: any) => {
            this.data = res;
          },
          (err) => {
            this.resolveAction(action.onError, err.error);
          }
        );
    }
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

  esolveText(item: any): string {
    return item?.text || '';  // Handle missing text gracefully
  }

  getRepeatData(path: string): any[] {
    try {
      const result = path.split('.').reduce((acc: { [x: string]: any; }, key: string | number) => acc?.[key], this) || [];
      console.log("📦 getRepeatData:", path, result);
      return Array.isArray(result) ? result : [];
    } catch (e) {
      console.error("❌ Error in getRepeatData:", e);
      return [];
    }
  }

  interpolate(template: string, item: any): string {
    if (!template || typeof template !== 'string') return template;

    return template.replace(/{{(.*?)}}/g, (_match, key) => {
      const trimmedKey = key.trim();

      // Smart resolve: strip 'item.' if present
      const finalKey = trimmedKey.startsWith('item.') ? trimmedKey.slice(5) : trimmedKey;

      const value = item?.[finalKey];
      console.log(`🧩 interpolate – key: ${trimmedKey} | value:`, value);
      return value ?? '';
    });
  }

  logAndReturn(item: any, label: string = ''): any {
    console.log(`🔍 ${label}`, item);
    return item;
  }
}
