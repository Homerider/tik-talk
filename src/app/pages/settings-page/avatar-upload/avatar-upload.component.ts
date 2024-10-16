import { Component, inject, Input, input, signal } from '@angular/core'
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component'
import { DndDirective } from '../../../common-ui/directives/dnd.directive'
import { FormsModule } from '@angular/forms'
import { ImgUrlPipe } from '../../../helpers/pipes/img-url.pipe'
import { Profile } from '../../../data/interfaces/profile.interface'
import { ProfileService } from '../../../data/services/profile.service'
import { OnChanges, SimpleChanges } from '@angular/core'

@Component({
    selector: 'app-avatar-upload',
    standalone: true,
    imports: [SvgIconComponent, DndDirective, FormsModule, ImgUrlPipe],
    templateUrl: './avatar-upload.component.html',
    styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
    profileService = inject(ProfileService)
    me = this.profileService.me
    profile: Profile | null = null

    preview = signal<string>('/assets/imgs/avatar-placeholder.png')

    @Input() avatar!: File | null

    loadAvatar(file: File) {
        const reader = new FileReader()
        reader.onloadend = (event) => {
            this.preview.set(event.target?.result?.toString() ?? '')
        }
        reader.readAsDataURL(file)
    }

    setPlaceholder() {
        this.preview.set('/assets/imgs/avatar-placeholder.png')
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['avatar']) {
            if (this.avatar) {
                this.loadAvatar(this.avatar)
            } else {
                this.setPlaceholder()
            }
        }
    }

    @Input() set avatarInput(value: File | null) {
        this.avatar = value
        if (value) {
            this.loadAvatar(value)
        } else {
            this.setPlaceholder()
        }
    }

    fileBrowserHandler(event: Event) {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        this.processFile(file)
    }

    onFileDropped(file: File) {
        this.processFile(file)
    }

    processFile(file: File | null | undefined) {
        if (!file || !file.type.match('image')) return

        const reader = new FileReader()
        reader.onloadend = (event) => {
            this.preview.set(event.target?.result?.toString() ?? '')
        }
        reader.readAsDataURL(file)
        this.avatar = file // Присваиваем файл переменной avatar
    }

    reset() {
        this.avatar = null
        this.setPlaceholder()
    }
}
