import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from './firebaseConfig';

const UnifiedAuthForm = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('login'); // 'login', 'register', ou 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Lista de emails autorizados como administradores (exemplo)
  const adminEmails = ['edirosky@gmail.com', 'sai.cosmar@gmail.com'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formType === 'login') {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        // Verifica se o email é de administrador
        if (adminEmails.includes(email.toLowerCase())) {
          navigate('/admin');
        } else {
          navigate('/app');
        }
      } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro no login. Verifique suas credenciais.');
      }
    } else if (formType === 'register') {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        alert('Usuário cadastrado com sucesso!');
        setFormType('login'); // Após cadastro, volta para a tela de login
      } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao cadastrar usuário.');
      }
    } else if (formType === 'reset') {
      try {
        await firebase.auth().sendPasswordResetEmail(email);
        alert('Email de redefinição de senha enviado!');
        setFormType('login'); // Após reset, volta para a tela de login
      } catch (error) {
        console.error('Erro ao enviar email de reset:', error);
        alert('Erro ao enviar email de redefinição.');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setFormType('login')}>Login</button>
        <button onClick={() => setFormType('register')}>Cadastro</button>
        <button onClick={() => setFormType('reset')}>Resetar Senha</button>
      </div>

      <h2>
        {formType === 'login' && 'Login'}
        {formType === 'register' && 'Novo Cadastro'}
        {formType === 'reset' && 'Resetar Senha'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* Em reset, não solicitamos a senha */}
        {formType !== 'reset' && (
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">
          {formType === 'login' && 'Entrar'}
          {formType === 'register' && 'Cadastrar'}
          {formType === 'reset' && 'Enviar Reset'}
        </button>
      </form>
    </div>
  );
};

export default UnifiedAuthForm;
