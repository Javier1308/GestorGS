import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Ingrese un email valido'),
  password: z.string().min(1, 'Ingrese su contrasena'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-600/30">
            <span className="text-2xl font-bold text-white">GS</span>
          </div>
          <h1 className="text-2xl font-bold text-white">GS Administraciones</h1>
          <p className="mt-2 text-sm text-slate-400">
            Plataforma de gestion de edificios
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 text-lg font-semibold text-slate-800">
            Iniciar Sesion
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contrasena"
              type="password"
              placeholder="Tu contrasena"
              error={errors.password?.message}
              {...register('password')}
            />

            {login.isError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">
                  Credenciales incorrectas. Intente de nuevo.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={login.isPending}
            >
              Ingresar
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          GS Administraciones &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
