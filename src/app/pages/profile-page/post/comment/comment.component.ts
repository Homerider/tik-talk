import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from "../../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {PostComponent} from "../post.component";

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment = input<PostComponent>()
}
