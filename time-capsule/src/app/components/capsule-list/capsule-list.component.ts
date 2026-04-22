import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Capsule } from '../../models/capsule.model';
import { User } from '../../models/user.model';
import { CapsuleService } from '../../services/capsule.service';

@Component({
  selector: 'app-capsule-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './capsule-list.component.html',
  styleUrl: './capsule-list.component.scss'
})
export class CapsuleListComponent {
  @Input() capsules: Capsule[] = [];
  @Input() currentUser: User | null = null;
  @Output() deleteCapsule = new EventEmitter<Capsule>();

  constructor(private capsuleService: CapsuleService, private router: Router) {}

  canEdit(capsule: Capsule): boolean {
    const currentUserId = this.currentUser?.id;
    const authorId = capsule.author.id;
    return currentUserId === authorId && !capsule.isOpened;
  }

  canOpen(capsule: Capsule): boolean {
    const now = new Date();
    const currentUserId = this.currentUser?.id;
    const authorId = capsule.author.id;
    const recipientId = capsule.recipient?.id;
    const isAuthor = currentUserId === authorId;
    const isRecipient = currentUserId === recipientId;
    const canOpenByDate = new Date(capsule.openAt) <= now;
    return canOpenByDate || isAuthor || isRecipient;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTimeUntilOpen(openAt: string): string {
    const now = new Date();
    const open = new Date(openAt);
    const diff = open.getTime() - now.getTime();

    if (diff <= 0) return 'Now';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  onCardClick(capsule: Capsule): void {
    if (capsule.isLocked && this.canOpen(capsule)) {
      this.capsuleService.openCapsule(capsule._id).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/feed']);
          Object.assign(capsule, response.capsule);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  onDelete(capsule: Capsule): void {
    this.deleteCapsule.emit(capsule);
  }
}
