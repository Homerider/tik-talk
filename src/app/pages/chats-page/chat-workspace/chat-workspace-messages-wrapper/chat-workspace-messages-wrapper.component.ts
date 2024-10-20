import {
	Component,
	ElementRef,
	HostListener,
	inject,
	input,
	Renderer2,
	ViewChild
} from '@angular/core'
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component'
import { MessageInputComponent } from '../../../../common-ui/message-input/message-input.component'
import { ChatsService } from '../../../../data/services/chats.service'
import { Chat, Message } from '../../../../data/interfaces/chats.interface'
import {
	debounceTime,
	firstValueFrom,
	fromEvent,
	Subject,
	takeUntil,
	timer
} from 'rxjs'
import { FormsModule } from '@angular/forms'
import { DateTime } from 'luxon'
import { NgForOf } from '@angular/common'

@Component({
	selector: 'app-chat-workspace-messages-wrapper',
	standalone: true,
	imports: [
		ChatWorkspaceMessageComponent,
		MessageInputComponent,
		FormsModule,
		NgForOf
	],
	templateUrl: './chat-workspace-messages-wrapper.component.html',
	styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent {
	@ViewChild('messagesContainer') messagesContainer!: ElementRef

	chatsService = inject(ChatsService)
	hostElement = inject(ElementRef)
	chat = input.required<Chat>()
	private destroy$ = new Subject<void>()
	r2 = inject(Renderer2)
	groupedActiveChatMessages = this.chatsService.groupedActiveChatMessages

	constructor() {
		this.startMessagePolling()
	}

	private startMessagePolling() {
		timer(0, 1800000) // Запуск сразу (0) и затем каждые 30 минут
			.pipe(takeUntil(this.destroy$))
			.subscribe(async () => {
				await firstValueFrom(this.chatsService.getChatById(this.chat().id))
				this.scrollToBottom() // Прокрутка вниз после обновления
			})
	}

	async onSendMessage(messageText: string) {
		await firstValueFrom(
			this.chatsService.sendMessage(this.chat().id, messageText)
		)
		await firstValueFrom(this.chatsService.getChatById(this.chat().id))
		this.scrollToBottom() // Прокрутка вниз после отправки
	}

	private scrollToBottom() {
		if (this.messagesContainer) {
			this.messagesContainer.nativeElement.scrollTop =
				this.messagesContainer.nativeElement.scrollHeight
		}
	}

	// Обработчик изменения размера окна
	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed()
	}

	ngAfterViewInit() {
		this.resizeFeed() // Установка высоты при инициализации компонента

		// Подписка на изменения размера окна с дебаунсом
		fromEvent(window, 'resize')
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe(() => {
				this.resizeFeed()
			})
	}

	ngOnDestroy() {
		this.destroy$.next()
		this.destroy$.complete() // Подписка завершается для предотвращения утечек памяти
	}

	// Метод для изменения размера элемента
	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect() // Получение координат
		const height = window.innerHeight - top - 28 // Вычисление новой высоты
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`) // Установка стиля высоты
	}
}
