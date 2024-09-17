import {Component, inject, input, signal} from '@angular/core';
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {DndDirective} from "../../../common-ui/directives/dnd.directive";
import {FormsModule} from "@angular/forms";
import {ImgUrlPipe} from "../../../helpers/pipes/img-url.pipe";
import {Profile} from "../../../data/interfaces/profile.interface";
import {ProfileService} from "../../../data/services/profile.service";

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [
    SvgIconComponent,
    DndDirective,
    FormsModule,
    ImgUrlPipe
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  profileService = inject(ProfileService)
  me = this.profileService.me
  profile = input<Profile>()

  preview = signal<string>('/assets/imgs/avatar-placeholder.png')

  avatar: File | null = null

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]
    this.proccessFile(file);
  }

  onFileDroped(file: File) {
    this.proccessFile(file)
  }

  proccessFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return

    const reader = new FileReader();

    reader.onloadend = event => {
      this.preview.set(event.target?.result?.toString() ?? '')
    }
    reader.readAsDataURL(file)
    this.avatar = file
  }
}
