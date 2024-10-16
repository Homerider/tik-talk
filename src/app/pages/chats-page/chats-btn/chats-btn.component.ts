import {Component, inject, Input, input, signal} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {Chat, LastMessageRes, Message} from "../../../data/interfaces/chats.interface";
import {DateTime} from "luxon";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {ChatsService} from "../../../data/services/chats.service";
import {NgIf} from "@angular/common";
import {PostComment} from "../../../data/interfaces/post.interface";

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    NgIf
  ],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>()
  unreadMessages = signal<LastMessageRes[]>([]); // Динамическое хранилище для сообщений

  // Метод для добавления нового непрочитанного сообщения
  addUnreadMessage(message: LastMessageRes) {
    console.log('Adding unread message:', message);
    this.unreadMessages.update(messages => [...messages, message]);
  }

  // Метод для обновления прочитанного сообщения
  markAsRead(messageId: number) {
    this.unreadMessages.update(messages =>
        messages.filter(message => message.id !== messageId)
    );
  }

  formatShortTime(dateString: string, locale: string = 'ru'): string {
    const date = DateTime.fromISO(dateString);

    if (!date.isValid) {
      return ''; // Возвращаем пустую строку если дата недействительна
    }

    return date.plus({ hours: 3 }).setLocale(locale).toFormat('HH:mm');
  }

  formatFullDate(dateString: string, locale: string = 'ru'): string {
    const date = DateTime.fromISO(dateString);

    if (!date.isValid) {
      return ''; // Возвращаем пустую строку если дата недействительна
    }

    return date.setLocale(locale).toFormat('dd.MM.yy');
  }
}
