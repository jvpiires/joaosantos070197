import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from 'primereact/toast';
import { FaUserPlus, FaSignInAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './LoginPage.css';
import { loginSchema, registerSchema } from '../types/zod.types';
import type { LoginInput, RegisterInput } from '../types/zod.types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();
  const toast = useRef<Toast>(null);
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerLoginField,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerSignUpField,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },  
    reset: resetRegisterForm
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  });

  const showToast = (severity: 'success' | 'error', title: string, message: string) => {
    toast.current?.show({
      severity: severity,
      content: () => (
        <div className={`flex items-center w-full max-w-sm p-4 rounded-lg shadow-xl border-l-4 bg-white ${
          severity === 'success' ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className="flex-shrink-0 mr-3">
            {severity === 'success' ? (
              <FaCheckCircle className="w-25 h-25 text-green-500" />
            ) : (
              <FaExclamationCircle className="w-25 h-25 text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-bold text-sm ${severity === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {title}
            </h4>
            <p className="text-gray-600 text-xs mt-1 leading-tight">{message}</p>
          </div>
        </div>
      ),
      life: 4000,
    });
  };

  const handleLoginSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await login({ login: data.login, password: data.password });
      showToast('success', 'Bem-vindo(a)!', 'Login realizado com sucesso.');
      setTimeout(() => navigate('/'), 500);
    } catch (error: any) {
      const status = error.response?.status;
      let msg = 'Ocorreu um erro inesperado.';
      let title = 'Erro no Sistema';

      if (status === 401 || status === 403) {
        title = 'Login Inválido';
        msg = 'Usuário ou senha incorretos.';
      } else if (error.message === 'Network Error') {
        title = 'Sem Conexão';
        msg = 'Não foi possível conectar ao servidor.';
      }

      showToast('error', title, msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      await registerUser({ login: data.login, password: data.password, userRole: 'USER' });
      showToast('success', 'Conta Criada!', 'Seu cadastro foi realizado.');
      
      resetRegisterForm();
      setTimeout(() => {
        setIsRegisterMode(false);
      }, 1500);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Não foi possível criar sua conta.';
      showToast('error', 'Erro no Cadastro', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    resetLoginForm();
    resetRegisterForm();
  };

  return (
    <>
      <Toast ref={toast} position="top-right" className="custom-toast-container" />
      <div className="grid min-h-screen w-full place-items-center bg-gray-100 relative px-4 text-center overflow-hidden">
        
        <div className={`container-login ${isRegisterMode ? 'active' : ''}`} id="container">
          
          {/* --- FORM REGISTRO (SIGN UP) --- */}
          <div className="form-container sign-up">
            <form onSubmit={handleSubmitRegister(handleRegisterSubmit)}>
              <h1 className="text-2xl font-bold mb-4 text-blue-900">Criar Conta</h1>
              <div className="flex gap-4 mb-4">
                <span className="p-2 bg-gray-100 rounded-full"><FaUserPlus size={20} className="text-blue-500"/></span>
              </div>
              <span className="text-sm text-gray-600 mb-4">Cadastre-se com seu usuário e senha</span>

              <div className="w-full mb-3">
                  <input {...registerSignUpField('login')} type="text" placeholder="Usuário" className={`bg-gray-100 text-gray-900 ${registerErrors.login ? 'border border-red-500' : ''}`}/>
                  {registerErrors.login && <span className="text-red-500 text-xs text-left w-full block ml-2">{registerErrors.login.message}</span>}
              </div>

              <div className="w-full mb-3">
                  <input {...registerSignUpField('password')} type="password" placeholder="Senha" className={`bg-gray-100 text-gray-900 ${registerErrors.password ? 'border border-red-500' : ''}`}/>
                  {registerErrors.password && <span className="text-red-500 text-xs text-left w-full block ml-2">{registerErrors.password.message}</span>}
              </div>

              <div className="w-full mb-3">
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

              <div className="w-full mb-3">
                  <input {...registerLoginField('login')} type="text" placeholder="Usuário" className={`bg-gray-100 text-gray-900 ${loginErrors.login ? 'border border-red-500' : ''}`}/>
                  {loginErrors.login && <span className="text-red-500 text-xs text-left w-full block ml-2">{loginErrors.login.message}</span>}
              </div>

              <div className="w-full mb-3">
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
    </>
  );
};
