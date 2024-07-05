import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';


export const UiComponentsRoutes: Routes = [
  {
    path: 'user',
    component : UserProfileComponent,
    
  },
];
