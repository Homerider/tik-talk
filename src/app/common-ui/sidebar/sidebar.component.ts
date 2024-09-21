import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ProfileService} from '../../data/services/profile.service';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {ClickDirective} from "../directives/click.directive";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    SubscriberCardComponent,
    AsyncPipe,
    JsonPipe,
    RouterLink,
    ImgUrlPipe,
    RouterLinkActive,
    ClickDirective,
    NgIf,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService)
  subcribers$ = this.profileService.getSubscribersShortList()
  showSearch: boolean = false;
  activeButton: string | null = null;

  me = this.profileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Сообщества',
      icon: 'communities',
      link: 'communities'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    }
  ]

  toggleSearch(menuItems: string) {
    if (menuItems === 'Сообщества') {
      this.showSearch = !this.showSearch;
      this.activeButton = this.showSearch ? menuItems : null;
    } else {
      this.activeButton = null;
      this.showSearch = false;
    }
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }
}
