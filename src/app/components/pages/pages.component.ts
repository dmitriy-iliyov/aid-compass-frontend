import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterModule, RouterLink, RouterLinkActive, Router, ActivatedRoute, Route} from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  @Input() pageCount?:number = 1;
  @Input() currentPage?:number = 0;

  @Output() pageClick = new EventEmitter<number>();
  onPageClick(page:number){
    if (this.currentPage == page) return;
    this.currentPage = page;
    this.pageClick.emit(this.currentPage)
  }
  // constructor(private route: ActivatedRoute) {}
  //
  // currentPage = 0;
  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     const page = +params['page'];
  //     this.currentPage = isNaN(page) ? 0 : page;
  //   });
  // }

  isActivePage(i: number): boolean {
    return i === this.currentPage;
  }


}
