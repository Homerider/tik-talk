import {Component, ElementRef, HostBinding, input, ViewChild} from '@angular/core';
import {Message} from "../../../../../data/interfaces/chats.interface";
import {AvatarCircleComponent} from "../../../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {DateTime} from "luxon";
import {TimePipe} from "../../../../../helpers/pipes/time.pipe";

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    TimePipe
  ],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss'
})
export class ChatWorkspaceMessageComponent {
  //Декоратор, который позволяет получить ссылку на элемент шаблона
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  message = input.required<Message>()

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }

  //Метод, который вызывается при инициализации компонента.
  //Автоматической прокрутка в самый низ сообщения при инициализации компонента.
  ngOnInit() {
    this.scrollToBottom();
  }

  //Этот метод срабатывает, когда изменяются входные свойства компонента.
  //Прокрутить к новому сообщению, если входящее сообщение изменилось.
  ngOnChanges() {
    this.scrollToBottom();
  }

  //Этот метод прокручивает контейнер сообщения в видимую область.
  //scrollIntoView — это метод, который прокручивает элемент, на который ссылается `messageContainer`, в видимую часть окна браузера.
  private scrollToBottom() {
    if (this.messageContainer) {
      //`{ behavior: 'smooth', block: 'end' }` создают плавную прокрутку и указывают, что элемент должен быть размещен внизу видимой области.
      this.messageContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  formatShortTime(dateString: string, locale: string = 'ru'): string {
    const date = DateTime.fromISO(dateString).plus({ hours: 3 }).setLocale(locale);
    return date.toFormat('HH:mm');
  }
}