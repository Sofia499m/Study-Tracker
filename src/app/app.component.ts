
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gridOutline, gridSharp, listOutline, listSharp, calendarOutline, calendarSharp, settingsOutline, settingsSharp  } from 'ionicons/icons';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {

  public appPages = [
    { title: 'Daskboard', url: '/dashboard', icon: 'grid' },
    { title: 'Task List', url: '/task-list', icon: 'list' },
    { title: 'Calendar', url: '/calendar', icon: 'calendar' },
    { title: 'Setting', url: '/setting', icon: 'settings' },
  ];
  constructor(private storage: Storage) {
    this.storage.create().then(async () => {
      const darkMode = await this.storage.get('darkMode') || false;
      document.documentElement.classList.toggle('dark', darkMode);
    });
    addIcons({ gridOutline, gridSharp, listOutline, listSharp, calendarOutline, calendarSharp, settingsOutline, settingsSharp  });
  }
}
