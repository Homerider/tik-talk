import {
	Component,
	effect,
	inject,
	Input,
	input,
	signal,
	ViewChild
} from '@angular/core'
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component'
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { ProfileService } from '../../data/services/profile.service'
import { firstValueFrom, switchMap } from 'rxjs'
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AsyncPipe, NgIf } from '@angular/common'
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe'
import { toObservable } from '@angular/core/rxjs-interop'
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component'
import { ChangeDetectorRef } from '@angular/core'

@Component({
	selector: 'app-settings-page',
	standalone: true,
	imports: [
		ProfileHeaderComponent,
		ReactiveFormsModule,
		AvatarUploadComponent,
		SvgIconComponent,
		RouterLink,
		AsyncPipe,
		ImgUrlPipe,
		NgIf
	],
	templateUrl: './settings-page.component.html',
	styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
	private fb = inject(FormBuilder)
	profileService = inject(ProfileService)
	route = inject(ActivatedRoute)
	avatar: File | null = null

	profile$ = toObservable(this.profileService.me)

	form: FormGroup

	constructor(private cdr: ChangeDetectorRef) {
		this.form = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			username: [{ value: '', disabled: true }, Validators.required],
			description: [''],
			city: [''],
			stack: ['']
		})

		effect(() => {
			const currentProfile = this.profileService.me()
			this.form.patchValue({
				...currentProfile,
				stack: this.mergeStack(currentProfile?.stack)
			})
		})
	}

	onDelete() {
		this.form.reset()
		this.avatar = null
		this.avatarUploader?.reset()
		this.cdr.detectChanges()
	}

	@ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent

	ngAfterViewInit() {}

	async onSave() {
		this.form.markAllAsTouched()
		this.form.updateValueAndValidity()

		if (this.form.invalid) return

		try {
			if (this.avatarUploader.avatar) {
				await firstValueFrom(
					this.profileService.uploadAvatar(this.avatarUploader.avatar)
				)
			}

			await firstValueFrom(
				this.profileService.patchProfile({
					...this.form.value,
					stack: this.splitStack(this.form.value.stack)
				})
			)
		} catch (error) {
			console.error('Ошибка при сохранении профиля:', error)
		}
	}

	splitStack(stack: string | null | string[] | undefined): string[] {
		if (!stack) return []
		if (Array.isArray(stack)) return stack
		return stack.split(',')
	}

	mergeStack(stack: string | null | string[] | undefined): string {
		if (!stack) return ''
		if (Array.isArray(stack)) return stack.join(',')
		return stack
	}
}
