import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {Chat, LastMessageRes, Message} from "../../../data/interfaces/chats.interface";
import {DateTime} from "luxon";

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>()
  message = input.required<Message>()

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
