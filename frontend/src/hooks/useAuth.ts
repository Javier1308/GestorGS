import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import type { LoginRequest } from '../types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useNotificationStore((s) => s.addToast);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken);
      addToast('success', 'Bienvenido', `Hola, ${response.user.firstName}`);
      navigate('/');
    },
    onError: () => {
      addToast('error', 'Error de autenticacion', 'Credenciales incorrectas');
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate('/login');
  };
}

export function useChangePassword() {
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      addToast('success', 'Contrasena actualizada');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo cambiar la contrasena');
    },
  });
}
