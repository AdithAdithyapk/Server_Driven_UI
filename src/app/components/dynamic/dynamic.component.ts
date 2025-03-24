import { Component, Input, OnInit, OnChanges, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ConfigserviceService } from 'src/app/services/configservice.service';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})
export class DynamicComponent implements OnInit {

  @Input() config: any;
  formData: any = {}; // Store form data
  data: any = {};     // Store API response data
  isModalVisible: boolean = false;  // Flag to control modal visibility
  modalId: string = '';            // ID for the modal (dynamic)
  modalTitle: string = '';         // Title for the modal
  modalContent: any[] = [];        // Dynamic content inside the modal
  modalActions: any = {};          // Modal actions (submit, close)
  constructor(
    private http: HttpClient,
    private router: Router,
    private commonsrc: CommonService,
    private configService: ConfigserviceService,
    private cdr: ChangeDetectorRef
  ) { }



  ngOnInit(): void {
    this.tryFetching(this.config?.action);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.tryFetching(this.config?.action);
    }
  }

  tryFetching(action: any) {
    console.log("action-------------->",action);
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
            console.log("this.data---------------->",this.data);
          },
          (err) => {
            this.resolveAction(action.onError, err.error);
          }
        );
    }
  }

  // Fetch dashboard data
  getDashBoardData() {
    this.commonsrc.request("GET", "api/dashboard-stats").subscribe((res: any) => {
      this.data = res;
    });
  }

  // Handle actions like opening modals or calling APIs
  handleAction(action: any) {
    if (action.type === 'openModal') {
      this.configService.getUIConfig('pages', action.modalId).subscribe(
        (data) => {
          this.openModal(action.modalId, action.title, data.htmlStructure, data.modalActions);
        },
        (error) => console.error('Error loading UI config:', error)
      );

    } else if (action.type === 'api') {
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

  // Open the modal and pass content and actions dynamically
  openModal(modalId: string, title: string, content: any[], actions: any) {
    this.modalTitle = title;
    this.modalContent = content;
    this.modalActions = actions;
    this.isModalVisible = true;
  }

  // Close the modal
  closeModal() {
    this.isModalVisible = false;
  }

  // Handle radio button change explicitly
  onRadioChange(fieldName: string, value: string) {
    this.formData[fieldName] = value;
    console.log(`Selected ${fieldName}:`, value);
    console.log("Form Data Submitted:", this.formData);
    // Force change detection (only needed if UI does not update)
    this.cdr.detectChanges();
  }

  onCheckboxChange(event: Event, fieldName: string, format?: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // If format is 'yes-no', store as 'Yes' or 'No', otherwise store as boolean
    if (format === 'yes-no') {
      this.formData[fieldName] = isChecked ? 'Yes' : 'No';
    } else {
      this.formData[fieldName] = isChecked;
    }
  }
  
  // Helper function to check if the value is 'Yes' or true
  isChecked(value: any): boolean {
    return value === true || value === 'Yes';
  }
  

  // Handle form submission
  handleSubmit() {
    console.log("Form Data Submitted:", this.formData);
    this.submitForm(this.formData);  // Submit form data
    this.closeModal();  // Close modal after submission
  }

  // Submit form data to the server
  submitForm(formData: any) {
    this.http.post('http://localhost:4000/api/students', formData)
      .subscribe((res) => {
        console.log("Student added successfully!", res);
        alert('Student added successfully!');
        this.tryFetching(this.config?.action);

      }, (err) => {
        console.error("Error adding student", err);
        alert('Error adding student');
      });
  }

  // Resolve action after API response
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
      default:
        break;
    }
  }

  // Resolve dynamic text, e.g., {{value}}
  resolveText(text: string, itemContext: any = null): string {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/{{(.*?)}}/g, (_match, path) => {
      try {
        const context = itemContext || this;
        return path.trim().split('.').reduce((acc: any, key: string) => acc?.[key], context) || '';
      } catch (e) {
        return '';
      }
    });
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
  
      // Remove 'item.' prefix if present
      const finalKey = trimmedKey.startsWith('item.') ? trimmedKey.slice(5) : trimmedKey;
  
      // Try to get from item context first
      let value = item?.[finalKey];
  
      // If not found in item, try to resolve from `this` (component context)
      if (value === undefined) {
        try {
          value = finalKey.split('.').reduce((acc: any, k: string | number) => acc?.[k], this);
        } catch (e) {
          value = '';
        }
      }
  
      console.log(`🧩 interpolate – key: ${trimmedKey} | value:`, value);
      return value ?? '';
    });
  }

  logAndReturn(item: any, label: string = ''): any {
    console.log(`🔍 ${label}`, item);
    return item;
  }

  getElementWithoutRepeat(element: any): any {
    return {
      ...element,
      repeat: null
    };
  }
}
