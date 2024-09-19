import {inject, Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CommentCreateDto, Post, PostCreateDto} from "../interfaces/post.interface";
import {switchMap, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    #http = inject(HttpClient)

    baseApiUrl = 'https://icherniakov.ru/yt-course/'

    posts = signal<Post[]>([])

    createPost(payload: PostCreateDto) {
        return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload)
            .pipe(
                switchMap(() => {
                   return this.fetchPosts()
                })
            )
    }

    fetchPosts() {
        return this.#http.get<Post[]>(`${this.baseApiUrl}post/`)
            .pipe(
                tap(res => this.posts.set(res)),
            )
    }

    createComment(payload: CommentCreateDto) {
        return this.#http.post<Comment>(`${this.baseApiUrl}comment/`, payload)
    }
}