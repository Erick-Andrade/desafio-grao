"use client"; // Necessário para usar hooks do cliente, como usePathname

import React from 'react';
import { FaHome, FaList, FaSignOutAlt } from 'react-icons/fa'; // Usando ícone de logout
import { MdLocationOn } from 'react-icons/md';
import { usePathname } from 'next/navigation'; // Hook de navegação
import { useUser } from '../context/UserContext'; // Hook para pegar o contexto do usuário
import styles from '../styles/menu.module.css';
import Link from 'next/link'; // Importando o componente Link do Next.js
import SearchBar from './SearchBar'; // Ajuste o caminho conforme necessário
import { useRouter } from 'next/navigation'; // Para redirecionamento após logout

const Menu: React.FC = () => {
  const { user, isLoading } = useUser(); // Usando o contexto do usuário
  const [menuOpen, setMenuOpen] = React.useState(false);

  const pathname = usePathname(); // Obtendo a rota atual
  const menuRoutes = ['/home', '/pedidos', '/perfil', '/restaurante']; // Definindo as rotas onde o Menu será mostrado
  const shouldRenderMenu = menuRoutes.includes(pathname); // Condição para renderizar o Menu
  const router = useRouter(); // Hook para navegação

  if (isLoading) {
    return <div></div>; // Componente de carregamento enquanto o usuário não está disponível
  }

  if (!shouldRenderMenu) {
    return null; // Se a rota atual não deve mostrar o Menu, ele não será renderizado
  }

  // Função de logout
  const logout = () => {
    // Limpar o localStorage
    localStorage.removeItem('user');
    
    // Redirecionar para a página inicial ou login
    router.push('/'); // Ajuste conforme necessário para sua rota de login
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/images/logo.png" alt="Logo" className={styles.logoImage} />
      </div>

      <div className={styles.location}>
        <span className={styles.greeting}>
          Olá, {user?.nome || 'Visitante'}! Você está neste endereço?
        </span>
        <div className={styles.address}>
          <MdLocationOn className={styles.locationIcon} />
          <span>
            {user?.endereco
              ? `${user.endereco.logradouro}, ${user.endereco.numero}`
              : 'Endereço não disponível'}
          </span>
        </div>
      </div>

      <div className={styles.menuIcon} onClick={() => setMenuOpen((prevState) => !prevState)}>
        <div className={styles.iconBar}></div>
        <div className={styles.iconBar}></div>
        <div className={styles.iconBar}></div>
      </div>

      <div className={`${styles.navLinks} ${menuOpen ? styles.mobileMenu : ''}`}>
        <Link href="/home" className={styles.navLink}>
          <FaHome /> Home
        </Link>
        <Link href="/pedidos" className={styles.navLink}>
          <FaList /> Pedidos
        </Link>
        {/* Alterando o link de "Perfil" para "Sair" e adicionando o ícone de logout */}

        <Link href='/' className={styles.navLink}>
            <FaSignOutAlt /> <span onClick={logout}>Sair</span>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(Menu); // Memoização para evitar renderizações desnecessárias
