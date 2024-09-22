import {AsyncPipe, NgForOf} from '@angular/common';
import {Component, computed, inject, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {firstValueFrom, from, switchMap} from 'rxjs';
import {ProfileHeaderComponent} from "../../common-ui/profile-header/profile-header.component";
import {SvgIconComponent} from "../../common-ui/svg-icon/svg-icon.component";
import {ImgUrlPipe} from "../../helpers/pipes/img-url.pipe";
import {ProfileService} from "../../data/services/profile.service";
import {PostFeedComponent} from "./post-feed/post-feed.component";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    NgForOf,
    ImgUrlPipe,
    RouterLinkActive,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  profileService = inject(ProfileService)
  route = inject(ActivatedRoute)
  router = inject(Router)

  me$ = toObservable(this.profileService.me)
  subcribers$ = this.profileService.getSubscribersShortList(5)

  isMyPage = signal(false)

  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id)
        if (id === 'me') return this.me$

        return this.profileService.getAccount(id)
      })
    )

}
