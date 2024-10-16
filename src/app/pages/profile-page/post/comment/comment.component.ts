import { Component, Input, input } from '@angular/core'
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component'
import { DatePipe } from '@angular/common'
import { PostComment } from '../../../../data/interfaces/post.interface'
import { DateTime } from 'luxon'
import { timePipe } from '../../../../helpers/pipes/time.pipe'

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [AvatarCircleComponent, DatePipe, timePipe],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss',
})
export class CommentComponent {
    @Input() comment!: PostComment

    formatFullDate(dateString: string, locale: string = 'en'): string {
        const date = DateTime.fromISO(dateString)
            .plus({ hours: 3 })
            .setLocale(locale)

        return date.toFormat('HH:mm dd.MM.yyyy')
    }
}
