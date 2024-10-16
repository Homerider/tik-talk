import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common'
import { Component, HostListener, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { ProfileService } from '../../data/services/profile.service'
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe'
import { SvgIconComponent } from '../svg-icon/svg-icon.component'
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { ClickDirective } from '../directives/click.directive'
import { Profile } from '../../data/interfaces/profile.interface'

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
		NgIf
	],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
	profileService = inject(ProfileService)
	subscribers$ = this.profileService.getSubscribersShortList()
	showSearch: boolean = false
	activeButton: string | null = null
	showLogoutButton: boolean = false
	me: Profile | null = null

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

	toggleSearch(menuItems: string, target: EventTarget | null) {
		if (!target) {
			this.showSearch = false
			return
		}

		if (menuItems === 'Сообщества') {
			this.showSearch = !this.showSearch
			this.activeButton = this.showSearch ? menuItems : null
		} else {
			this.activeButton = null
			this.showSearch = false
		}
	}

	toggleLogoutButton() {
		this.showLogoutButton = !this.showLogoutButton
	}

	ngOnInit() {
		firstValueFrom(this.profileService.getMe()).then((profile) => {
			this.me = profile
		})
	}

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		const targetElement = event.target as HTMLElement

		const clickedInsideSearchInput = (targetElement as HTMLElement).closest(
			'.search-container'
		)
		const clickedInsideSearch = (targetElement as HTMLElement).closest(
			'.menu-item'
		)
		const clickedInsideLogout = (targetElement as HTMLElement).closest(
			'.sidebar__footer'
		)

		if (!clickedInsideSearch && !clickedInsideSearchInput && this.showSearch) {
			this.showSearch = false
			this.activeButton = null
		}

		if (!clickedInsideLogout) {
			this.showLogoutButton = false
		}
	}
}
