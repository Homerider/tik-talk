import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { AvatarUploadComponent } from '../../settings-page/avatar-upload/avatar-upload.component'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ProfileService } from '../../../data/services/profile.service'
import { debounceTime, startWith, Subscription, switchMap } from 'rxjs'
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component'

@Component({
    selector: 'app-profile-filters',
    standalone: true,
    imports: [AvatarUploadComponent, ReactiveFormsModule, SvgIconComponent],
    templateUrl: './profile-filters.component.html',
    styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
    fb = inject(FormBuilder)
    profileService = inject(ProfileService)

    searchForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        stack: [''],
    })

    searchFormSub!: Subscription

    constructor() {
        this.searchFormSub = this.searchForm.valueChanges
            .pipe(
                startWith({}),
                debounceTime(300),
                switchMap((formValue) => {
                    return this.profileService.filterProfiles(formValue)
                }),
            )
            .subscribe()
    }

    ngOnDestroy() {
        this.searchFormSub.unsubscribe()
    }
}
