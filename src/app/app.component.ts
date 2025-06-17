import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MenuComponent} from './components/menu/menu.component';
import { Renderer2 } from '@angular/core';
import { filter } from 'rxjs/operators';
import {RoleService} from './data/services/role.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'aid-compass-frontend';
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {


    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        if (url.includes('/doctor')) {
          this.setTheme('theme-doctor');
        } else if (url.includes('/jurist')) {
          this.setTheme('theme-lawyer');
        } else if (url.includes('user')) {
          this.setTheme('theme-yellow');
        } else {
          this.setTheme('theme-doctor');
        }
      });
  }

  setTheme(themeClass: string) {
    const body = document.body;
    this.renderer.removeClass(body, 'theme-doctor');
    this.renderer.removeClass(body, 'theme-lawyer');
    this.renderer.removeClass(body, 'theme-yellow');

    if (themeClass) {
      this.renderer.addClass(body, themeClass);
    }
  }
}
