import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position, Contestant, Voter, VoteSubmission, ElectionSettings, Result, Analytics } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'http://localhost:3000/api';
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('currentUser');
    const user = token ? JSON.parse(token) : null;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': user && user.token ? `Bearer ${user.token}` : ''
    });
  }

  // States
  getStates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/positions/states/list`);
  }

  // Positions
  getPositions(category?: string, state?: string): Observable<Position[]> {
    let url = `${this.apiUrl}/positions`;
    const params: string[] = [];
    if (category) params.push(`category=${category}`);
    if (state) params.push(`state=${state}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get<Position[]>(url, { headers: this.getHeaders() });
  }

  createPosition(position: Partial<Position>): Observable<Position> {
    return this.http.post<Position>(`${this.apiUrl}/positions`, position, { headers: this.getHeaders() });
  }

  updatePosition(id: string, position: Partial<Position>): Observable<Position> {
    return this.http.put<Position>(`${this.apiUrl}/positions/${id}`, position, { headers: this.getHeaders() });
  }

  deletePosition(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/positions/${id}`, { headers: this.getHeaders() });
  }

  // Contestants
  getContestants(positionId?: string): Observable<Contestant[]> {
    const url = positionId 
      ? `${this.apiUrl}/contestants/position/${positionId}`
      : `${this.apiUrl}/contestants`;
    return this.http.get<Contestant[]>(url, { headers: this.getHeaders() });
  }

  createContestant(contestant: Partial<Contestant>): Observable<Contestant> {
    return this.http.post<Contestant>(`${this.apiUrl}/contestants`, contestant, { headers: this.getHeaders() });
  }

  updateContestant(id: string, contestant: Partial<Contestant>): Observable<Contestant> {
    return this.http.put<Contestant>(`${this.apiUrl}/contestants/${id}`, contestant, { headers: this.getHeaders() });
  }

  deleteContestant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contestants/${id}`, { headers: this.getHeaders() });
  }

  // Voters
  getVoters(): Observable<Voter[]> {
    return this.http.get<Voter[]>(`${this.apiUrl}/voters`, { headers: this.getHeaders() });
  }

  createVoter(voter: Partial<Voter>): Observable<Voter> {
    return this.http.post<Voter>(`${this.apiUrl}/voters`, voter, { headers: this.getHeaders() });
  }

  updateVoter(id: string, voter: Partial<Voter>): Observable<Voter> {
    return this.http.put<Voter>(`${this.apiUrl}/voters/${id}`, voter, { headers: this.getHeaders() });
  }

  toggleVoterStatus(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/voters/${id}/toggle-status`, {}, { headers: this.getHeaders() });
  }

  uploadVotersExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('currentUser');
    const user = token ? JSON.parse(token) : null;
    const headers = new HttpHeaders({
      'Authorization': user && user.token ? `Bearer ${user.token}` : ''
    });
    return this.http.post(`${this.apiUrl}/voters/upload`, formData, { headers });
  }

  // Voting
  submitVotes(votes: VoteSubmission[], category: string, state?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/votes/submit`, { votes, category, state }, { headers: this.getHeaders() });
  }

  getVotingStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/votes/status`, { headers: this.getHeaders() });
  }

  getAvailableElections(): Observable<ElectionSettings[]> {
    return this.http.get<ElectionSettings[]>(`${this.apiUrl}/votes/available-elections`, { headers: this.getHeaders() });
  }

  // Elections
  getElectionSettings(category?: string, state?: string): Observable<ElectionSettings[]> {
    let url = `${this.apiUrl}/elections`;
    const params: string[] = [];
    if (category) params.push(`category=${category}`);
    if (state) params.push(`state=${state}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get<ElectionSettings[]>(url, { headers: this.getHeaders() });
  }

  createElection(election: Partial<ElectionSettings>): Observable<ElectionSettings> {
    return this.http.post<ElectionSettings>(`${this.apiUrl}/elections`, election, { headers: this.getHeaders() });
  }

  updateElection(id: string, election: Partial<ElectionSettings>): Observable<ElectionSettings> {
    return this.http.put<ElectionSettings>(`${this.apiUrl}/elections/${id}`, election, { headers: this.getHeaders() });
  }

  // Results
  getResults(category: string, state?: string): Observable<{ positions: Result[] }> {
    let url = `${this.apiUrl}/results?category=${category}`;
    if (state) url += `&state=${state}`;
    return this.http.get<{ positions: Result[] }>(url, { headers: this.getHeaders() });
  }

  getAnalytics(): Observable<Analytics> {
    return this.http.get<Analytics>(`${this.apiUrl}/results/analytics`, { headers: this.getHeaders() });
  }

  exportResults(category: string, state?: string): Observable<Blob> {
    let url = `${this.apiUrl}/results/export?category=${category}`;
    if (state) url += `&state=${state}`;
    return this.http.get(url, { 
      headers: this.getHeaders(), 
      responseType: 'blob'
    });
  }
}

