import {
    Component,
    EventEmitter,
    HostBinding,
    inject,
    Input,
    input,
    Output,
    Renderer2,
} from '@angular/core'
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component'
import { NgIf } from '@angular/common'
import { ProfileService } from '../../../data/services/profile.service'
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-post-input',
    standalone: true,
    imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
    templateUrl: './post-input.component.html',
    styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
    r2 = inject(Renderer2)
    profile = inject(ProfileService).me

    isCommentInput = input(false)
    postId = input<number>(0)
    postText = ''

    @Output() created = new EventEmitter<string>()

    @HostBinding('class.comment')
    get isComment() {
        return this.isCommentInput
    }

    onTextAreaInput(event: Event) {
        const textarea = event.target as HTMLTextAreaElement
        this.r2.setStyle(textarea, 'height', 'auto')
        this.r2.setStyle(textarea, 'height', `${textarea.scrollHeight}px`)
    }

    onSend() {
        if (this.postText.trim()) {
            this.created.emit(this.postText)
            this.postText = ''
        }
    }

    onKeyUp() {
        this.onSend()
    }
}
