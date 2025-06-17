import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {
  currentUrl: string = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
    console.log('Страница не найдена для пути:', this.currentUrl);
  }
}
