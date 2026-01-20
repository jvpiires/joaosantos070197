import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Message } from 'primereact/message';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import './LoginPage.css';

// --- SCHEMAS ---

const loginSchema = z.object({
  login: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const registerSchema = z.object({
  login: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Apenas letras, números, . - _'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register: registerLoginField,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const {
    register: registerSignUpField,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
    reset: resetRegisterForm
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      await login(data);
      navigate('/');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao realizar login.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      await registerUser({ login: data.login, password: data.password, userRole: 'USER' });
      setStatusMessage({ type: 'success', text: 'Conta criada! Faça login.' });
      resetRegisterForm();
      setTimeout(() => {
        setIsRegisterMode(false);
        setStatusMessage(null);
      }, 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao criar conta.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setStatusMessage(null);
    resetLoginForm();
    resetRegisterForm();
  };

  return (
    <div className="flex bg-white min-h-screen w-full relative">
      <div className={`container-login ${isRegisterMode ? 'active' : ''}`} id="container">
        
        {/* --- FORM REGISTRO (SIGN UP) --- */}
        <div className="form-container sign-up">
          <form onSubmit={handleSubmitRegister(handleRegisterSubmit)}>
            <h1 className="text-2xl font-bold mb-4 text-blue-900">Criar Conta</h1>
            <div className="flex gap-4 mb-4">
              <span className="p-2 bg-gray-100 rounded-full"><FaUserPlus size={20} className="text-blue-500"/></span>
            </div>
            <span className="text-sm text-gray-600 mb-4">Cadastre-se com seu usuário e senha</span>
            
            {(statusMessage && isRegisterMode) && (
              <Message severity={statusMessage.type} text={statusMessage.text} className="w-full mb-2 custom-msg" />
            )}

            <div className="w-full">
                <input {...registerSignUpField('login')} type="text" placeholder="Usuário" className={`bg-gray-100 text-gray-900 ${registerErrors.login ? 'border border-red-500' : ''}`}/>
                {registerErrors.login && <span className="text-red-500 text-xs text-left w-full block ml-2">{registerErrors.login.message}</span>}
            </div>

            <div className="w-full">
                <input {...registerSignUpField('password')} type="password" placeholder="Senha" className={`bg-gray-100 text-gray-900 ${registerErrors.password ? 'border border-red-500' : ''}`}/>
                {registerErrors.password && <span className="text-red-500 text-xs text-left w-full block ml-2">{registerErrors.password.message}</span>}
            </div>

             <div className="w-full">
                <input {...registerSignUpField('confirmPassword')} type="password" placeholder="Confirme a Senha" className={`bg-gray-100 text-gray-900 ${registerErrors.confirmPassword ? 'border border-red-500' : ''}`}/>
                {registerErrors.confirmPassword && <span className="text-red-500 text-xs text-left w-full block ml-2">{registerErrors.confirmPassword.message}</span>}
            </div>
            
            <button type="submit" disabled={isLoading} className="mt-4">{isLoading ? 'Cadastrando...' : 'Cadastrar'}</button>
            
            <div className="lg:hidden mt-4 text-center">
               <p className="text-gray-600">Já tem uma conta?</p> 
               <span onClick={toggleMode} className="text-blue-600 font-bold cursor-pointer underline">Entrar</span>
            </div>
          </form>
        </div>

        {/* --- FORM LOGIN (SIGN IN) --- */}
        <div className="form-container sign-in">
          <form onSubmit={handleSubmitLogin(handleLoginSubmit)}>
            <h1 className="text-2xl font-bold mb-4 text-blue-900">Entrar</h1>
            <div className="flex gap-4 mb-4">
               <span className="p-2 bg-gray-100 rounded-full"><FaSignInAlt size={20} className="text-blue-900"/></span>
            </div>
            <span className="text-sm text-gray-600 mb-4">Use sua conta registrada</span>

            {(statusMessage && !isRegisterMode) && (
              <Message severity={statusMessage.type} text={statusMessage.text} className="w-full mb-2 custom-msg" />
            )}

            <div className="w-full">
                <input {...registerLoginField('login')} type="text" placeholder="Usuário" className={`bg-gray-100 text-gray-900 ${loginErrors.login ? 'border border-red-500' : ''}`}/>
                {loginErrors.login && <span className="text-red-500 text-xs text-left w-full block ml-2">{loginErrors.login.message}</span>}
            </div>

            <div className="w-full">
                <input {...registerLoginField('password')} type="password" placeholder="Senha" className={`bg-gray-100 text-gray-900 ${loginErrors.password ? 'border border-red-500' : ''}`}/>
                {loginErrors.password && <span className="text-red-500 text-xs text-left w-full block ml-2">{loginErrors.password.message}</span>}
            </div>

            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Esqueci minha senha</a>
            <button type="submit" disabled={isLoading}>{isLoading ? 'Entrando...' : 'Entrar'}</button>
            <div className="lg:hidden mt-4 text-center">
               <p className="text-gray-600">Ainda não tem conta?</p> 
               <span onClick={toggleMode} className="text-blue-600 font-bold cursor-pointer underline">Criar conta</span>
            </div>
          </form>
        </div>

        {/* --- OVERLAY / SLIDER (Desktop Only) --- */}
        <div className="toggle-container hidden lg:block">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
              <p className="text-white mb-8">Para se manter conectado conosco, faça login com suas informações pessoais</p>
              <button className="active-button border border-white text-white px-8 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-white hover:text-blue-900 transition-colors" onClick={toggleMode}>Entrar</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-3xl font-bold text-white mb-2">Olá, Visitante!</h1>
              <p className="text-white mb-8">Insira seus dados pessoais e comece sua jornada conosco</p>
              <button className="active-button border border-white text-white px-8 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-white hover:text-blue-900 transition-colors" onClick={toggleMode}>Criar Conta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
