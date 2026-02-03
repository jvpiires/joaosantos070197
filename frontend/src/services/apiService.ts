import { BehaviorSubject, Observable } from 'rxjs';
import apiClient from './apiClient';
import type { User, Regional, AlbumNotification } from '../types/api.types';

class ApiService {
  // BehaviorSubjects para gerenciar estado
  private usersSubject = new BehaviorSubject<User[]>([]);
  private regionaisSubject = new BehaviorSubject<Regional[]>([]);
  private notificationsSubject = new BehaviorSubject<AlbumNotification[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  public users$ = this.usersSubject.asObservable();
  public regionais$ = this.regionaisSubject.asObservable();
  public notifications$ = this.notificationsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor() {
    // Client já vem com interceptors configurados em apiClient
  }

  // ===== USERS =====
  async loadUsers(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const response = await apiClient.get<User[]>('/api/users');
      this.usersSubject.next(response.data);
      this.errorSubject.next(null);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar usuários';
      this.errorSubject.next(message);
      console.error('Erro ao carregar usuários:', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async changeUserRole(userId: number, role: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      await apiClient.put(`/api/users/${userId}/role`, { role });
      await this.loadUsers(); // Recarregar lista
      this.errorSubject.next(null);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao alterar role';
      this.errorSubject.next(message);
      console.error('Erro ao alterar role:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  // ===== REGIONAIS =====
  async loadRegionais(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const response = await apiClient.get<Regional[]>('/api/regionais');
      this.regionaisSubject.next(response.data);
      this.errorSubject.next(null);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar regionais';
      this.errorSubject.next(message);
      console.error('Erro ao carregar regionais:', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  getRegionais(): Observable<Regional[]> {
    return this.regionais$;
  }

  // ===== NOTIFICAÇÕES =====
  addNotification(notification: AlbumNotification): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  getNotifications(): Observable<AlbumNotification[]> {
    return this.notifications$;
  }

  // ===== ESTADO GERAL =====
  getLoading(): Observable<boolean> {
    return this.loading$;
  }

  getError(): Observable<string | null> {
    return this.error$;
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}

// Singleton
export const apiService = new ApiService();
