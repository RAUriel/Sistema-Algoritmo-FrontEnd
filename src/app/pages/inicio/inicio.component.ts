import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  constructor(private router: Router) {}

  toggleMenu() {
    const menuList = document.querySelector('.menu__list');
    if (menuList) {
      menuList.classList.toggle('menu__list--animate');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
