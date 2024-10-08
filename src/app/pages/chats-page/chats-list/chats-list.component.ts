import {Component, inject} from '@angular/core';
import {ChatsBtnComponent} from "../chats-btn/chats-btn.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {ChatsService} from "../../../data/services/chats.service";
import {AsyncPipe} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {map, startWith, switchMap} from "rxjs";

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('')

  chats$ = this.chatsService.getMyChats()
      .pipe(
          switchMap(chats => {
            return this.filterChatsControl.valueChanges
                .pipe(
                    startWith(''),
                    map(inputValue => {
                      return chats.filter(chat => {
                        return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`.toLowerCase().includes(inputValue?.toLowerCase() ?? '')
                      })
                    })
                )
          })
      )
}
