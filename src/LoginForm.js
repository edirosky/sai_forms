import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('login'); // 'login' e 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Lida com autenticação ou recuperação de senha
  const handleAuth = async (e) => {
    e.preventDefault();
    setError(''); // Limpa mensagens de erro anteriores

    try {
      if (formType === 'login') {
        // Tentando fazer login com email e senha
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Salva o token no localStorage após login bem-sucedido
        localStorage.setItem('authToken', userCredential.user.accessToken);
        // Redireciona para a página principal após login
        navigate('/app');
      } else if (formType === 'reset') {
        // Envia um link de reset de senha para o email
        await sendPasswordResetEmail(auth, email);
        alert('Email de recuperação enviado!');
        setFormType('login'); // Muda para o formulário de login após o envio
      }
    } catch (error) {
      handleError(error); // Lida com erros de autenticação
    }
  };

  // Lida com os erros baseados no código de erro retornado
  const handleError = (error) => {
    const messages = {
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Conta desativada',
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde'
    };
    
    setError(messages[error.code] || 'Erro desconhecido');
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button 
          onClick={() => setFormType('login')} 
          className={formType === 'login' ? 'active' : ''}
        >
          Login
        </button>
        <button 
          onClick={() => setFormType('reset')} 
          className={formType === 'reset' ? 'active' : ''}
        >
          Resetar Senha
        </button>
      </div>

      <h2 className="auth-title">
        {formType === 'login' && 'Acesso ao Sistema'}
        {formType === 'reset' && 'Recuperação de Senha'}
      </h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAuth} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
            placeholder="seu@email.com"
          />
        </div>

        {formType === 'login' && (
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
        )}

        <button type="submit" className="auth-submit">
          {formType === 'login' ? 'Entrar' : 'Enviar Link'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
