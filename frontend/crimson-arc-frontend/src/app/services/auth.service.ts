import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Admin, Voter } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject: BehaviorSubject<Admin | Voter | null>;
  public currentUser: Observable<Admin | Voter | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Admin | Voter | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Admin | Voter | null {
    return this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? 'role' in user && user.role === 'admin' : false;
  }

  public get isVoter(): boolean {
    const user = this.currentUserValue;
    return user ? 'phoneNumber' in user : false;
  }

  adminLogin(email: string, password: string): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/admin/login`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  voterLogin(maidenName: string, phoneNumber: string): Observable<Voter> {
    return this.http.post<Voter>(`${this.apiUrl}/voter/login`, { maidenName, phoneNumber })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout(): Observable<any> | void {
    const user = this.currentUserValue;
    
    // If user is a voter with a token, call logout endpoint to clear session
    if (user && 'phoneNumber' in user && user.token) {
      return this.http.post(`${this.apiUrl}/voter/logout`, {}, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      }).pipe(map(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        return true;
      }));
    } else {
      // For admins or users without tokens, just clear local storage
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    }
  }

  // Force logout (for session expired scenarios)
  forceLogout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    return user ? user.token : null;
  }

  // Update voter's votedCategories in local storage
  updateVoterStatus(votedCategories: { national: boolean; state: boolean }, hasVoted: boolean): void {
    const currentUser = this.currentUserValue;
    if (currentUser && 'phoneNumber' in currentUser) {
      const updatedUser = {
        ...currentUser,
        votedCategories,
        hasVoted
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }
}
