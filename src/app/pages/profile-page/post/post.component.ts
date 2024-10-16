import { Component, inject, input, OnInit, signal } from '@angular/core'
import { Post, PostComment } from '../../../data/interfaces/post.interface'
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component'
import { DatePipe } from '@angular/common'
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component'
import { PostInputComponent } from '../post-input/post-input.component'
import { CommentComponent } from './comment/comment.component'
import { PostService } from '../../../data/services/post.service'
import { firstValueFrom } from 'rxjs'
import { timePipe } from '../../../helpers/pipes/time.pipe'
import { ProfileService } from '../../../data/services/profile.service'
import { DateTime } from 'luxon'

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [
		AvatarCircleComponent,
		DatePipe,
		SvgIconComponent,
		PostInputComponent,
		CommentComponent,
		timePipe
	],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
	post = input<Post>()
	profile = inject(ProfileService).me
	comments = signal<PostComment[]>([])

	postService = inject(PostService)

	async ngOnInit() {
		this.comments.set(this.post()!.comments)
	}

	formatShortTime(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString)
			.plus({ hours: 3 })
			.setLocale(locale)

		return date.toFormat('HH:mm')
	}

	formatFullDate(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString).setLocale(locale)

		return date.toFormat('cccc, dd MMMM yyyy')
	}

	async onCreated(commentText: string) {
		firstValueFrom(
			this.postService.createComment({
				text: commentText,
				authorId: this.profile()!.id,
				postId: this.post()!.id
			})
		)
			.then(async () => {
				const comments = await firstValueFrom(
					this.postService.getCommentsByPostId(this.post()!.id)
				)
				this.comments.set(comments)
			})
			.catch((error) => console.error('Error creating comment:', error))
		return
	}
}
