import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useChangePassword } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import type { Role } from '../types';

// ── Change Password ────────────────────────────────────────────────────

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingrese su contrasena actual'),
    newPassword: z.string().min(6, 'Minimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme su contrasena'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

// ── Create User ────────────────────────────────────────────────────────

const createUserSchema = z.object({
  email: z.string().email('Email invalido'),
  firstName: z.string().min(1, 'Ingrese el nombre'),
  lastName: z.string().min(1, 'Ingrese el apellido'),
  role: z.enum(['ADMIN', 'STAFF', 'TECHNICIAN', 'OWNER'] as const),
  password: z.string().min(6, 'Minimo 6 caracteres'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

// ── Page ───────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const changePassword = useChangePassword();
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Password form
  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    formState: { errors: errPwd },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onChangePassword = (data: PasswordFormData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => resetPwd() }
    );
  };

  // Users (admin only)
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getUsers,
    enabled: isAdmin,
  });

  const toggleActive = useMutation({
    mutationFn: authService.toggleUserActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addToast('success', 'Estado de usuario actualizado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo actualizar el usuario');
    },
  });

  // Create user form
  const {
    register: regUser,
    handleSubmit: handleUser,
    reset: resetUser,
    formState: { errors: errUser },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const createUser = useMutation({
    mutationFn: authService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addToast('success', 'Usuario creado exitosamente');
      resetUser();
      setShowCreateUser(false);
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo crear el usuario');
    },
  });

  const roleLabels: Record<Role, string> = {
    ADMIN: 'Administrador',
    STAFF: 'Staff',
    TECHNICIAN: 'Tecnico',
    OWNER: 'Propietario',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configuracion</h1>
        <p className="mt-1 text-sm text-slate-500">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Change Password */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Cambiar Contrasena
        </h2>
        <form
          onSubmit={handlePwd(onChangePassword)}
          className="max-w-md space-y-4"
        >
          <Input
            label="Contrasena Actual"
            type="password"
            error={errPwd.currentPassword?.message}
            {...regPwd('currentPassword')}
          />
          <Input
            label="Nueva Contrasena"
            type="password"
            error={errPwd.newPassword?.message}
            {...regPwd('newPassword')}
          />
          <Input
            label="Confirmar Contrasena"
            type="password"
            error={errPwd.confirmPassword?.message}
            {...regPwd('confirmPassword')}
          />
          <Button type="submit" isLoading={changePassword.isPending}>
            Cambiar Contrasena
          </Button>
        </form>
      </div>

      {/* User Management (Admin) */}
      {isAdmin && (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Gestion de Usuarios
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCreateUser(!showCreateUser)}
            >
              {showCreateUser ? 'Cancelar' : 'Nuevo Usuario'}
            </Button>
          </div>

          {/* Create user form */}
          {showCreateUser && (
            <form
              onSubmit={handleUser((data) => createUser.mutate(data))}
              className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  error={errUser.firstName?.message}
                  {...regUser('firstName')}
                />
                <Input
                  label="Apellido"
                  error={errUser.lastName?.message}
                  {...regUser('lastName')}
                />
              </div>
              <Input
                label="Email"
                type="email"
                error={errUser.email?.message}
                {...regUser('email')}
              />
              <Input
                label="Contrasena"
                type="password"
                error={errUser.password?.message}
                {...regUser('password')}
              />
              <Select
                label="Rol"
                options={[
                  { value: 'STAFF', label: 'Staff' },
                  { value: 'TECHNICIAN', label: 'Tecnico' },
                  { value: 'OWNER', label: 'Propietario' },
                  { value: 'ADMIN', label: 'Administrador' },
                ]}
                error={errUser.role?.message}
                {...regUser('role')}
              />
              <div className="flex justify-end">
                <Button type="submit" isLoading={createUser.isPending}>
                  Crear Usuario
                </Button>
              </div>
            </form>
          )}

          {/* Users table */}
          {loadingUsers ? (
            <Spinner size="sm" className="py-8" />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Rol
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                        {u.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Badge color="violet">{roleLabels[u.role]}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center">
                        <Badge color={u.isActive ? 'green' : 'gray'}>
                          {u.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant={u.isActive ? 'danger' : 'outline'}
                          onClick={() => toggleActive.mutate(u.id)}
                          disabled={u.id === user?.id}
                        >
                          {u.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
