import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  profileForm: FormGroup;
  hidden: boolean = false;
  token: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      password: ['', Validators.minLength(6)],
      passwordconfirm: ['', Validators.minLength(6)],
      phone: [''],
      role: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      console.log(`Token received: ${this.token}`);
      if (this.token) {
        localStorage.setItem('currentUser', JSON.stringify({ token: this.token }));
        this.fetchUserProfile();
      } else {
        console.error('No token found in URL parameters');
      }
    });
  }

  fetchUserProfile() {
    // Fetch user profile using AuthService
    if (this.token) {
      this.authService.getUserProfile().subscribe(
        data => {
          this.user = data;
          this.patchForm();
        },
        error => {
          console.error('Error fetching user profile', error);
        }
      );
    } else {
      console.error('Token not available');
    }
  }

  patchForm() {
    this.profileForm.patchValue({
      nom: this.user.nom,
      prenom: this.user.prenom,
      email: this.user.email,
      login: this.user.login,
      phone: this.user.phone,
      role: this.user.role,
      status: this.user.status
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = { ...this.profileForm.value, id: this.user.id };
      this.authService.updateUserProfile(formData).subscribe(
        updatedUser => {
          console.log('Profile updated successfully:', updatedUser);
        },
        error => {
          console.error('Error updating profile:', error);
        }
      );
    } else {
      console.error('Form validation failed');
    }
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
