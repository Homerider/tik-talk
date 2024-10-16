import {Component, ElementRef, HostBinding, Input, input, ViewChild} from '@angular/core';
import {Message} from "../../../../../data/interfaces/chats.interface";
import {AvatarCircleComponent} from "../../../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {DateTime} from "luxon";
import {timePipe} from "../../../../../helpers/pipes/time.pipe";


@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    timePipe
  ],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss'
})
export class ChatWorkspaceMessageComponent {
  //Декоратор, который позволяет получить ссылку на элемент шаблона
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  @Input() message!: Message;

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message.isMine;
  }


  formatShortTime(dateString: string, locale: string = 'ru'): string {
    const date = DateTime.fromISO(dateString).plus({ hours: 3 }).setLocale(locale);
    return date.toFormat('HH:mm');
  }
}