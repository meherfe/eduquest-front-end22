import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9090'; // Replace with your backend API URL
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth`, { email, password }).pipe(
      tap(user => {
        if (user && user.token) {
          // Store user details and jwt token in local storage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): Observable<any> {
    // Clear user details from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // Optionally, you can still send a logout request to the server
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(response => {
        console.log('Logout successful, server response:', response);
      }, error => {
        console.error('Logout failed', error);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.currentUserValue.token}`
    });
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers });
  }

  updateUserProfile(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.currentUserValue.token}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/${formData.id}`, formData, { headers });
  }

  getAllUsers(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')!).token}`
    });
    return this.http.get<any>(`${this.apiUrl}/users`, { headers });
  }

  archiveUser(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')!).token}`
    });
    return this.http.patch<any>(`${this.apiUrl}/User/${userId}`, {}, { headers });
  }

  verifyResetToken(token: string): Observable<any> {
    console.log(`Verifying token: ${token}`);
    return this.http.get<any>(`${this.apiUrl}/reset-password/${token}`);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password/request`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password/reset`, { token, newPassword });
  }
}
