import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CapsuleService } from '../../services/capsule.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capsule-create',
  imports: [FormsModule, CommonModule],
  templateUrl: './capsule-create.component.html',
  styleUrl: './capsule-create.component.scss'
})
export class CapsuleCreateComponent {
  content="";
  recipientEmail="";
  openAt="";
  imageUrl="";
  error="";

  constructor(private capsuleService: CapsuleService, private router: Router){}

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

    this.capsuleService.createCapsule({
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
