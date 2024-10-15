import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Output,
  Renderer2,
  signal, ViewChild
} from '@angular/core';
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {MessageInputComponent} from "../../../../common-ui/message-input/message-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {Chat, Message} from "../../../../data/interfaces/chats.interface";
import {debounceTime, firstValueFrom, fromEvent, Subject, takeUntil, timer} from "rxjs";
import {FormsModule} from "@angular/forms";
import {DateTime} from "luxon";
import {NgForOf} from "@angular/common";

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
  chatsService = inject(ChatsService);
  hostElement = inject(ElementRef);
  chat = input.required<Chat>();
  private destroy$ = new Subject<void>();
  messages = this.chatsService.activeChatMessages;
  r2 = inject(Renderer2);

  constructor() {
    // Запуск таймера для периодической подгрузки новых сообщений
    this.startMessagePolling();
  }

  // Новый метод для периодического запроса сообщений
  private startMessagePolling() {
    timer(0, 3600000) // Запуск сразу (0) и затем каждый час
        .pipe(takeUntil(this.destroy$)) // Завершение подписки при уничтожении компонента
        .subscribe(async () => {
          await firstValueFrom(this.chatsService.getChatById(this.chat().id));
          // возможно, вам нужно обновить массив сообщений вручную, если он не обновляется автоматически
        });
  }

  // Метод для отправки сообщения
  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText));
    await firstValueFrom(this.chatsService.getChatById(this.chat().id)); // Обновление сообщений после отправки
  }

  // Обработчик изменения размера окна
  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  ngAfterViewInit() {
    this.resizeFeed(); // Установка высоты при инициализации компонента

    // Подписка на изменения размера окна с дебаунсом
    fromEvent(window, 'resize')
        .pipe(debounceTime(500), takeUntil(this.destroy$))
        .subscribe(() => {
          this.resizeFeed();
        });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete(); // Подписка завершается для предотвращения утечек памяти
  }

  // Метод для изменения размера элемента
  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect(); // Получение координат
    const height = window.innerHeight - top - 28; // Вычисление новой высоты
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`); // Установка стиля высоты
  }

  getGroupedMessages() {
    const messagesArray = this.messages();  // Получение актуального значения массива сообщений
    const groupedMessages = new Map<string, Message[]>();  // Карта для хранения сгруппированных сообщений

    // Получение текущей даты и даты вчера
    const today = DateTime.now().startOf('day');
    const yesterday = today.minus({ days: 1 });

    messagesArray.forEach((message: Message) => {
      const messageDate = DateTime.fromISO(message.createdAt).plus({ hours: 3 }).startOf('day');

      // Определяем, какую метку использовать
      let dateLabel: string;
      if (messageDate.equals(today)) {
        dateLabel = 'Сегодня';
      } else if (messageDate.equals(yesterday)) {
        dateLabel = 'Вчера';
      } else {
        dateLabel = messageDate.toFormat('MM.dd.yyyy');
      }

      if (!groupedMessages.has(dateLabel)) {
        groupedMessages.set(dateLabel, []);
      }
      groupedMessages.get(dateLabel)?.push(message);
    });

    return Array.from(groupedMessages.entries()); // Возвращает массив пар [дата, сообщения]
  }

}