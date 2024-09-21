import {AsyncPipe} from '@angular/common';
import {Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {ProfileCardComponent} from '../../common-ui/profile-card/profile-card.component';
import {ProfileService} from '../../data/services/profile.service';
import {ProfileFiltersComponent} from "./profile-filters/profile-filters.component";
import {fromEvent} from "rxjs";


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    ProfileCardComponent,
    AsyncPipe,
    ProfileFiltersComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  profileService = inject(ProfileService)
  profiles = this.profileService.filteredProfiles
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);


  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed()
  }


  ngAfterViewInit() {
    this.resizeFeed()

    fromEvent(window, 'resize')
        .subscribe(() => {
          console.log(12313)
        })
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
  }
}

