import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Page not found");
  }
}
