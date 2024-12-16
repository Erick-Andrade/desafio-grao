'use client';  // Adicionando isso para tornar este componente um Client Component

import React, { FormEvent, useState } from 'react';
import styles from './styles/Login.module.css';
import { useRouter } from 'next/navigation';
import { useUser } from "./context/UserContext";

const Login: React.FC = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alterna entre visível e oculto
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('./api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verifique se a resposta é válida
      const data = await response.json(); // Esperando um JSON
      console.log(data);
      if (response.ok) {
        // Redireciona para a página Home
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(data.message);
        data.user.nome = data.user.nome.split(' ')[0];
        setUser(data.user);
        router.push('/home'); // Supondo que a Home esteja configurada corretamente
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro ao autenticar:', error);
    }
  };

  const handleRegister = () => {
    router.push('/cadastro');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"} // Altera o tipo do input baseado no estado
              id="password"
              name="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={togglePasswordVisibility} className={styles.showPasswordButton}>
              {/* Ícone do olho (você pode substituir por qualquer ícone desejado) */}
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className={styles.buttonGroup}>
            <button
                className={styles.button}
                type="button"
                onClick={handleRegister}
              >
                Cadastrar
              </button>
              <button className={styles.button} type="submit">
                Entrar
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
