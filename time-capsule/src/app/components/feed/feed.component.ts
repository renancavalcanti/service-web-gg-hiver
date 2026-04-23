import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CapsuleListComponent } from '../capsule-list/capsule-list.component';
import { CapsuleService } from '../../services/capsule.service';
import { Capsule } from '../../models/capsule.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';

type TabType = 'all' | 'received' | 'sent';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, CapsuleListComponent, RouterLink],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  capsules: Capsule[] = [];
  currentUser: User | null = null;
  activeTab: TabType = 'all';
  newReceivedCount = 0;

  constructor(
    private readonly capsuleService: CapsuleService,
    private readonly socketService: SocketService,
    private readonly authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser){
      this.socketService.joinRoom(this.currentUser.id);
    }

    this.socketService.onCapsuleCreate().subscribe((capsule) => {
      console.log(capsule)
      console.log(this.currentUser)
      if(this.currentUser?.id === capsule.author._id || this.currentUser?.id === capsule.recipient._id){
        this.loadCapsules();
        //this.capsules.unshift(this.formatCapsule(capsule))
      }

    });
  }

  ngOnInit(): void {
    this.loadCapsules();
  }

  setTab(tab: TabType): void {
    this.activeTab = tab;
    if (tab === 'received') {
      this.newReceivedCount = 0;
    }
    this.loadCapsules();
  }

  getTabTitle(): string {
    const titles: Record<TabType, string> = {
      all: 'My Capsules',
      received: 'Received',
      sent: 'Sent'
    };
    return titles[this.activeTab];
  }

  loadCapsules(): void {
    let request: Observable<{ capsules: Capsule[] }>;

    switch (this.activeTab) {
      case 'received':
        request = this.capsuleService.getReceivedCapsules();
        break;
      case 'sent':
        request = this.capsuleService.getSentCapsules();
        break;
      default:
        request = this.capsuleService.getAllCapsules();
    }

    request.subscribe({
      next: (response) => {
        this.capsules = response.capsules.map(c => this.formatCapsule(c));
      },
      error: (err) => {
        console.error('Error loading capsules:', err);
      }
    });
  }

  formatCapsule(capsule: Capsule): Capsule {
    const now = new Date();
    const currentUserId = this.currentUser?.id;
    const authorId = capsule.author.id;
    const recipientId = capsule.recipient?.id;
    const isAuthor = currentUserId === authorId;
    const isRecipient = currentUserId === recipientId;
    const canOpenByDate = new Date(capsule.openAt) <= now;
    const canOpen = canOpenByDate || isAuthor || isRecipient;

    return {
      ...capsule,
      isLocked: !canOpen || !capsule.isOpened,
      canOpen: canOpen
    };
  }

  shouldShowCapsule(capsule: Capsule): boolean {
    const currentUserId = this.currentUser?.id;
    const authorId = capsule.author.id;
    const recipientId = capsule.recipient?.id;

    switch (this.activeTab) {
      case 'received':
        return recipientId === currentUserId;
      case 'sent':
        return authorId === currentUserId && !!capsule.recipient;
      default:
        return authorId === currentUserId || recipientId === currentUserId;
    }
  }

  deleteCapsule(capsule: Capsule): void {

    if(!confirm("Are you sure you want to delete this capsule?")){
      return;
    }

    this.capsuleService.deleteCapsule(capsule._id).subscribe({
      next: () => {
        this.loadCapsules();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
