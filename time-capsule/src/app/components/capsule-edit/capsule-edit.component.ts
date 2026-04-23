import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapsuleService } from '../../services/capsule.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-capsule-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './capsule-edit.component.html',
  styleUrl: './capsule-edit.component.scss'
})
export class CapsuleEditComponent {
  capsuleId = '';
  content = '';
  imageUrl = '';
  recipientEmail = '';
  openAt = '';
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly capsuleService: CapsuleService
  ){
    this.capsuleId = this.route.snapshot.paramMap.get('id') || '';

    console.log(this.capsuleId);

    if(!this.capsuleId){
      this.router.navigate(['/feed']);
      return;
    }

    this.loadCapsule();
  }

  loadCapsule(): void {
    this.capsuleService.getCapsuleById(this.capsuleId).subscribe({
      next: (response) => {
        console.log(response);
        this.content = response.capsule.content;
        this.imageUrl = response.capsule.imageUrl;
        this.recipientEmail = response.capsule.recipient.email;
        this.openAt = this.formatDateTimeLocal(response.capsule.openAt);

      },
      error: (err) => {
        console.log(err);
        this.router.navigate(['/feed']);
      }
    });
  }

  formatDateTimeLocal(dateString: string): string{
    const date = new Date(dateString);
    console.log(date.toISOString())
    return date.toISOString().slice(0, 16);
  }

  onSubmit(): void{
    if(!this.content.trim()){
      this.error = 'Content is required.';
      return;
    }

    if(!this.openAt){
      this.error = 'Open Date is required.';
      return;
    }

    const openDate = new Date(this.openAt);
    if(openDate <= new Date()){
      this.error = 'Open date must be in future.'
      return;
    }

    this.capsuleService.updateCapsule(this.capsuleId, {
      content: this.content.trim(),
      imageUrl: this.imageUrl.trim(),
      recipientEmail: this.recipientEmail.trim(),
      openAt: openDate.toISOString()
    }).subscribe({
      next: (res)=>{
        console.log(res);
        this.router.navigate(['/feed']);
      },
      error: (err)=>{
        console.log(err);
        this.error = err.error.message;
      }
    })
  }

  onCancel(): void{
    this.router.navigate(['/feed']);
  }
}
