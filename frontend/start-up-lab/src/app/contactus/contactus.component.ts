import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent {
  formData = {
    name: '',
    lastName: '',
    company: '',
    email: '',
    message: ''
  };

  openEmailApp(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const subject = encodeURIComponent(`Contact Form Submission from ${this.formData.name} ${this.formData.lastName}`);
    const body = encodeURIComponent(
      `Name: ${this.formData.name} ${this.formData.lastName}\n` +
      `Company: ${this.formData.company}\n` +
      `Email: ${this.formData.email}\n\n` +
      `Message:\n${this.formData.message}`
    );

    const mailtoLink = `mailto:pawat.songkhopanit@studenti.unitn.it?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink; // Open the email application
  }
}