import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../../types/zod.types';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import type { RegisterData } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  visible: boolean;
  onHide: () => void;
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userLogin');
  localStorage.removeItem('userRole');
};

export const AuthModal = ({ visible, onHide }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userRole: "USER"
    }
  });

  const showToast = (severity: "success" | "info" | "warn" | "error", summary: string, detail: string) => {
    const toastFn = severity === "error" ? toast.error : 
                    severity === "success" ? toast.success : 
                    severity === "warn" ? toast.warning : toast.info;
    
    toastFn(summary, {
      description: detail,
      duration: 5000
    });
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  };

  const onLoginSubmit = async (data: LoginInput) => {
      try {
          const response = await authService.login(data);
          const claims = parseJwt(response.token);
          const roleRaw = claims.role || claims.userRole || "USER";
          const roleNormalizada = roleRaw.toString().toUpperCase();
          const userId = claims.userId || claims.id || claims.sub;
          const userIdNumber = userId ? parseInt(userId, 10) : undefined;

          login(response.token, data.login, roleNormalizada, userIdNumber);
          navigate('/home');
          onHide();
          showToast("success", "Login OK", "Acesso liberado.");
      } catch (error: any) {
          console.error("Erro Login:", error);
          const detail = error?.response?.data?.message || error?.message || "Erro ao realizar login. Verifique as credenciais.";
          showToast("error", "Login recusado", detail);
      }
  };

  const onRegisterSubmit = async (data: RegisterInput) => {
    try {
      const payload: RegisterData = {
        login: data.login,
        password: data.password,
        userRole: data.userRole || "USER"
      };
      await authService.register(payload);
      showToast("success", "Conta criada", "Faça login para continuar.");
      setIsLogin(true); 
      loginForm.setValue("login", data.login);
      registerForm.reset();
    } catch (error: any) {
      const detail = error?.response?.data?.message || error?.message || "Erro ao criar conta.";
      showToast("error", "Cadastro recusado", detail);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog 
      visible={visible} 
      onHide={onHide}
      draggable={false}
      resizable={false}
      showHeader={false}
      className="font-mono border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      contentClassName="p-6 md:p-10 bg-white"
    >
      <div className="flex flex-col space-y-6 w-full max-w-[320px] md:min-w-[400px]">
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-black mx-auto flex items-center justify-center rounded-xl">
            <span className="text-white text-3xl font-black italic">⚡</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">
            {isLogin ? 'Songs - Login' : 'Songs - Register'}
          </h2>
        </div>

        <form 
          onSubmit={isLogin ? loginForm.handleSubmit(onLoginSubmit) : registerForm.handleSubmit(onRegisterSubmit)} 
          className="flex flex-col space-y-5"
        >
          <div className="flex flex-col space-y-1 mt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">User / Login</label>
            <InputText 
              {...(isLogin ? loginForm.register("login") : registerForm.register("login"))}
              placeholder="seu_usuario"
              className={`border-2 border-black p-3 rounded-none focus:shadow-none font-bold uppercase text-xs transition-all 
                ${(isLogin ? loginForm.formState.errors.login : registerForm.formState.errors.login) ? 'border-red-500' : 'focus:bg-cyan-50'}`}
            />
            <ErrorMessage error={isLogin ? loginForm.formState.errors.login : registerForm.formState.errors.login} />
          </div>

          <div className="flex flex-col space-y-1 mt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
            <InputText 
              {...(isLogin ? loginForm.register("password") : registerForm.register("password"))}
              type="password"
              placeholder="******"
              className={`border-2 border-black p-3 rounded-none focus:shadow-none transition-all 
                ${(isLogin ? loginForm.formState.errors.password : registerForm.formState.errors.password) ? 'border-red-500' : 'focus:bg-cyan-50'}`}
            />
            <ErrorMessage error={isLogin ? loginForm.formState.errors.password : registerForm.formState.errors.password} />
          </div>

          {!isLogin && (
            <div className="flex flex-col space-y-1 mt-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirm / Pass</label>
              <InputText 
                {...registerForm.register("confirmPassword")}
                type="password"
                placeholder="******"
                className={`border-2 border-black p-3 rounded-none focus:shadow-none transition-all 
                  ${registerForm.formState.errors.confirmPassword ? 'border-red-500' : 'focus:bg-cyan-50'}`}
              />
              <ErrorMessage error={registerForm.formState.errors.confirmPassword} />
            </div>
          )}

          <Button 
            label={isLogin ? "Logar" : "Registrar-se"} 
            type="submit"
            severity="contrast"
            raised
            className="border-none py-3 mt-5 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          />
        </form>

        <button 
          onClick={toggleMode}
          type="button" 
          className="border-none py-2 mt-4 font-black uppercase tracking-[0.1em] hover:cursor-pointer hover:underline transition-all text-gray-500 text-[10px] italic bg-transparent"
        >
          {isLogin ? "> Criar uma conta" : "> Já tenho uma conta"}
        </button>
      </div>
    </Dialog>
  );
};

const ErrorMessage = ({ error }: { error: any }) => {
  if (!error) return null;
  return <span style={{color : "red"}} className="text-[12px] font-bold uppercase mt-2 italic ">{error.message}</span>;
};