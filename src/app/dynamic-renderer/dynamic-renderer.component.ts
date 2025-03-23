import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dynamic-renderer',
  templateUrl: './dynamic-renderer.component.html',
  styleUrls: ['./dynamic-renderer.component.scss']
})
export class DynamicRendererComponent implements OnInit {
  @Input() element: any; // This will be the dynamic element input
  formData: any = {}; // For handling dynamic data binding

  constructor() {}

  ngOnInit() {
    // Handle initialization logic, if needed
  }

  // Resolving dynamic text values (replace placeholders like {{data.stats.totalStudents}})
  resolveText(text: string): string {
    const regex = /{{\s*([\w.]+)\s*}}/g;
    return text.replace(regex, (match, key) => {
      return this.resolveDataPlaceholder(key);
    });
  }

  // Simulate resolving the data from an object (you can adapt this to fetch data from a service)
  resolveDataPlaceholder(key: string): string {
    const data = {
      stats: {
        totalStudents: 1000,
        facultyCount: 50,
        upcomingEvents: 5,
        collectedFees: 50000,
        recentNotices: 'Notice about upcoming events',
      }
    };
  
    const keys = key.split('.');
    let value: any = data;
  
    // Safely traverse the object using optional chaining
    keys.forEach(k => {
      value = value?.[k]; // Use ?. to ensure you don't try to access properties on undefined
    });
  
    // If value is undefined, return the key or handle it as needed
    return value !== undefined ? value : `No data for ${key}`;
  }
  
  

  // Handle button actions
  handleAction(action: string) {
    console.log(`Button clicked: ${action}`);
    // Handle action logic (e.g., navigation, API calls)
  }

  isLayoutClass(classes: string): boolean {
    // Define layout-related classes like col-md-*, row, etc.
    const layoutClasses = ['col-', 'row', 'container', 'col-md-', 'col-sm-', 'col-lg-', 'col-xl-'];
  
    if (!classes) return false;
  
    // Check if any of the layout classes are included
    return layoutClasses.some(cls => classes.includes(cls));
  }
  
}
