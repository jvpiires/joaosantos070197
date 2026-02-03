import { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { type User } from '../../types/api.types';
import { toast } from 'sonner';
import './UsersManagement.css';

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    loadUsers();
    const subscription = apiService.getUsers().subscribe((u) => setUsers(u));
    return () => subscription.unsubscribe();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      await apiService.loadUsers();
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: number, newRole: string) {
    try {
      setLoading(true);
      await apiService.changeUserRole(userId, newRole);
      toast.success('Role alterada com sucesso');
      setEditingId(null);
    } catch (error) {
      toast.error('Erro ao alterar role');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="users-management">
      <div className="users-header">
        <h2>Gerenciar Usuários</h2>
        <button onClick={loadUsers} disabled={loading} className="btn-refresh">
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Login</th>
              <th>Role</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.login}</td>
                <td>
                  {editingId === user.id ? (
                    <select 
                      value={selectedRole} 
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="role-select"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === user.id ? (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleRoleChange(user.id, selectedRole)}
                        disabled={loading}
                        className="btn-save"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-cancel"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(user.id);
                        setSelectedRole(user.role);
                      }}
                      className="btn-edit"
                    >
                      Editar Role
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="empty-state">
          <p>Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
}
