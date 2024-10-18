import { Component, inject, input, OnInit, signal } from '@angular/core'
import { Post, PostComment } from '../../../data/interfaces/post.interface'
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component'
import { DatePipe, I18nPluralPipe } from '@angular/common'
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
		timePipe,
		I18nPluralPipe
	],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
	post = input<Post>()
	profile = inject(ProfileService).me
	comments = signal<PostComment[]>([])
	postService = inject(PostService)
	locale: string = 'ru'

	timeMapping = {
		'0': 'Только что',
		one: '1 секунда назад',
		other: '# секунд назад',

		'1m': '1 минута назад',
		'2m': '# минут назад',

		'1h': '1 час назад',
		'2h': '# часов назад',

		'1d': '1 день назад',
		'2d': '# дней назад'
	}

	// Метод returnDifference вернёт количество разницы во времени
	get returnDifference(): number {
		const now = DateTime.local()
		const createdAt = DateTime.fromISO(this.post()!.createdAt, { zone: 'utc' })
			.setZone(DateTime.local().zone)
			.setLocale(this.locale)

		return Math.floor(now.diff(createdAt, 'seconds').seconds)
	}

	// Метод для возврата строки для отображения
	get timeDifference(): string {
		const diffInSeconds = this.returnDifference

		if (diffInSeconds < 60) {
			return diffInSeconds === 1 ? 'one' : 'other'
		} else if (diffInSeconds < 3600) {
			const minutes = Math.floor(diffInSeconds / 60)
			return minutes === 1 ? '1m' : '2m'
		} else if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600)
			return hours === 1 ? '1h' : '2h'
		} else {
			const days = Math.floor(diffInSeconds / 86400)
			return days === 1 ? '1d' : '2d'
		}
	}

	async ngOnInit() {
		this.comments.set(this.post()!.comments)
	}

	formatShortTime(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' }) // предполагаем, что исходная дата в UTC
			.setZone(DateTime.local().zone) // устанавливаем зону по умолчанию для браузера
			.setLocale(locale)
		return date.toFormat('HH:mm')
	}

	formatFullDate(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' }).setLocale(locale)

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
