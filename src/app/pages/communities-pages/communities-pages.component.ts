import { Component, inject, Input, input, signal } from '@angular/core'
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe'
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component'
import { ProfileService } from '../../data/services/profile.service'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AsyncPipe } from '@angular/common'
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component'
import { PostFeedComponent } from '../profile-page/post-feed/post-feed.component'

@Component({
	selector: 'app-communities-pages',
	standalone: true,
	imports: [
		ImgUrlPipe,
		ProfileHeaderComponent,
		AsyncPipe,
		SvgIconComponent,
		PostFeedComponent,
		RouterLink
	],
	templateUrl: './communities-pages.component.html',
	styleUrl: './communities-pages.component.scss'
})
export class CommunitiesPagesComponent {
	profileService = inject(ProfileService)
	itliceist$ = this.profileService.getSubscribersShortList(5)
	boostyIvan$ = this.profileService.getSubscribersShortList(4)
	formula1$ = this.profileService.getSubscribersShortList(2)
	Angular$ = this.profileService.getSubscribersShortList(4)
	SportAPL$ = this.profileService.getSubscribersShortList(3)
}
