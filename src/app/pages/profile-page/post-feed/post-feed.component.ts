import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter, HostBinding,
  HostListener,
  inject, input,
  Input,
  OnDestroy,
  OnInit, Output,
  Renderer2
} from '@angular/core';
import {PostInputComponent} from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {debounceTime, firstValueFrom, fromEvent, Subject, takeUntil} from "rxjs";
import {ProfileService} from "../../../data/services/profile.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent,
    NgForOf
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit, AfterViewInit, OnDestroy {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  private destroy$ = new Subject<void>();
  profile = inject(ProfileService).me;

  feed: any[] = [];

  @Input() isCommentInput = false;
  @Input() postId: number = 0;


  @Output() created = new EventEmitter<void>();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput;
  }

  constructor() {
    this.loadPosts(); // Загружаем посты
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
        .pipe(debounceTime(500), takeUntil(this.destroy$))
        .subscribe(() => {
          this.resizeFeed();
        });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 48;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  // Метод для загрузки постов
  private loadPosts() {
    firstValueFrom(this.postService.fetchPosts())
        .then((posts) => {
          this.feed = posts; // Сохраняем загруженные посты в feed
        })
        .catch((error) => console.error('Error loading posts:', error));
  }

  // Метод для создания поста или комментария
  onCreatePost(postText: string) {
    if (!postText) return;

    // Создание поста
    firstValueFrom(this.postService.createPost({
      title: 'Клевый пост',
      content: postText,
      authorId: this.profile()!.id
    }))
        .then(() => {
          this.loadPosts(); // Обновляем посты после создания поста
        })
        .catch((error) => console.error('Error creating post:', error));
  }

  trackByPostId(index: number, post: any): number {
    return post.id;
  }
}