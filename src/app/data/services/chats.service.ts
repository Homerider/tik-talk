import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface'
import { ProfileService } from './profile.service'
import { map, single } from 'rxjs'
import { DateTime } from 'luxon'

@Injectable({
	providedIn: 'root'
})
export class ChatsService {
	http = inject(HttpClient)
	me = inject(ProfileService).me
	groupedActiveChatMessages = signal<[string, Message[]][]>([])

	baseApiUrl = 'https://icherniakov.ru/yt-course/'
	chatsUrl = `${this.baseApiUrl}chat/`
	messageUrl = `${this.baseApiUrl}message/`

	getChatById(chatId: number) {
		return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
			map((chat) => {
				const patchedMessages = chat.messages.map((message) => {
					return {
						...message,
						user:
							chat.userFirst.id === message.userFromId
								? chat.userFirst
								: chat.userSecond,
						isMine: message.userFromId === this.me()!.id
					}
				})

				// Группируем патченные сообщения
				const groupedMessages = this.getGroupMessages(patchedMessages)
				this.groupedActiveChatMessages.set(groupedMessages) // Используем новый сигнал

				return {
					...chat,
					companion:
						chat.userFirst.id === this.me()!.id
							? chat.userSecond
							: chat.userFirst,
					messages: patchedMessages
				}
			})
		)
	}

	getGroupMessages(messages: Message[]) {
		const groupedMessages = new Map<string, Message[]>()

		const today = DateTime.now().startOf('day')
		const yesterday = today.minus({ days: 1 })

		messages.forEach((message: Message) => {
			const messageDate = DateTime.fromISO(message.createdAt, { zone: 'utc' })
				.setZone(DateTime.local().zone)
				.startOf('day')

			let dateLabel: string
			if (messageDate.equals(today)) {
				dateLabel = 'Сегодня'
			} else if (messageDate.equals(yesterday)) {
				dateLabel = 'Вчера'
			} else {
				dateLabel = messageDate.toFormat('MM.dd.yyyy')
			}

			if (!groupedMessages.has(dateLabel)) {
				groupedMessages.set(dateLabel, [])
			}
			groupedMessages.get(dateLabel)?.push(message)
		})

		return Array.from(groupedMessages.entries()) // Возвращает массив пар [дата, сообщения]
	}

	sendMessage(chatId: number, message: string) {
		return this.http.post(
			`${this.messageUrl}send/${chatId}`,
			{},
			{
				params: {
					message
				}
			}
		)
	}

	createChat(userId: number) {
		return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {})
	}

	getMyChats() {
		return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`)
	}
}
