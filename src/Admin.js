import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!user) {
      navigate("/"); // Redireciona para o login se não houver usuário autenticado
    }
  }, [user, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Painel de Administração</h1>
      <p>
        Bem-vindo ao painel de administração! Aqui você pode gerenciar os usuários
        e suas permissões.
      </p>
      {/* Adicione funcionalidades específicas de administração aqui */}
      <button onClick={() => navigate("/")}>Sair</button>
    </div>
  );
}

export default AdminPanel;
