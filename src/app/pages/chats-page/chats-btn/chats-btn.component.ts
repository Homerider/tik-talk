import {Component, inject, input, signal} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {Chat, LastMessageRes, Message} from "../../../data/interfaces/chats.interface";
import {DateTime} from "luxon";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {ChatsService} from "../../../data/services/chats.service";
import {NgIf} from "@angular/common";

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
  message = input.required<Message>()
  messages = signal<Message[]>([])


  async ngOnInit() {
    const chatData = this.chat();
    if (chatData) {
      this.messages.set(chatData.messages);
    }
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
