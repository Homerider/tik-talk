import { Routes } from '@angular/router'
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { SearchPageComponent } from './pages/search-page/search-page.component'
import { ProfilePageComponent } from './pages/profile-page/profile-page.component'
import { LayoutComponent } from './common-ui/layout/layout.component'
import { canActivateAuth } from './auth/access.guard'
import { SettingsPageComponent } from './pages/settings-page/settings-page.component'
import { CommunitiesPagesComponent } from './pages/communities-pages/communities-pages.component'
import { chatsRoutes } from './pages/chats-page/chatsRoutes'

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
            { path: 'profile/:id', component: ProfilePageComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'settings', component: SettingsPageComponent },
            { path: 'communities', component: CommunitiesPagesComponent },
            { path: 'chats', loadChildren: () => chatsRoutes },
        ],
        canActivate: [canActivateAuth],
    },
    { path: 'login', component: LoginPageComponent },
]
