import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type TabType = 'all' | 'received' | 'sent';
@Component({
  selector: 'app-feed',
  imports: [RouterLink],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  activeTab: TabType = 'all';


  setTab(tab: TabType): void {
    this.activeTab = tab;
  }
}
