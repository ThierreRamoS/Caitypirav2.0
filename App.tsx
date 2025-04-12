import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, useEmulators } from './src/config/firebaseConfig';
import { createTestUser } from './src/utils/setupEmulatorData';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Telas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import GameScreen from './src/screens/GameScreen';
import MenuScreen from './src/screens/MenuScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import DiagnosticScreen from './src/screens/DiagnosticScreen';
import TasksScreen from './src/screens/TasksScreen';
import ShopScreen from './src/screens/ShopScreen';
import InvitesScreen from './src/screens/InvitesScreen';
import GameRoomsScreen from './src/screens/GameRoomsScreen';
import MultiplayerGameScreen from './src/screens/MultiplayerGameScreen';

// Serviços
import { UserProfile, getUserProfile } from './src/services/userService';

// Tipos de navegação
type AppScreen = 'login' | 'register' | 'menu' | 'rooms' | 'game' | 'profile' | 'shop' | 'diagnostic' | 'tasks' | 'invites' | 'gameRooms' | 'multiplayerGame';

export default function App() {
  // Estado de autenticação
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de navegação
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  
  // Estado do jogo
  const [userCoins, setUserCoins] = useState<number>(500);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [currentGameRoomId, setCurrentGameRoomId] = useState<string | null>(null);

  // Inicialização do emulador com dados de teste
  useEffect(() => {
    if (__DEV__ && useEmulators) {
      import('./src/utils/setupEmulatorData').then(m => m.createTestUser());
    }
  }, []);

  // Verificar o estado de autenticação
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        
        if (user) {
          // Buscar perfil do usuário quando autenticado
          const profile = await getUserProfile(user.uid);
          
          if (profile) {
            setUserProfile(profile);
            setUserCoins(profile.caityCoins);
            // Quando o usuário faz login, vai para o menu
            setCurrentScreen('menu');
          } else {
            // Se não tiver perfil, volta para login
            setError('Perfil de usuário não encontrado. Tente fazer login novamente.');
            await auth.signOut();
          }
        } else {
          // Quando o usuário faz logout, volta para a tela de login
          setCurrentScreen('login');
          setUserProfile(null);
        }
        
        if (initializing) setInitializing(false);
      });

      // Limpar a inscrição quando o componente for desmontado
      return unsubscribe;
    } catch (err) {
      console.error('Erro ao inicializar o Firebase:', err);
      setError('Erro ao conectar com o Firebase. Verifique sua configuração.');
      setInitializing(false);
      return () => {};
    }
  }, [initializing]);

  // Handlers de navegação
  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const handleRoomSelect = (roomId: string) => {
    setCurrentRoomId(roomId);
    setCurrentScreen('game');
  };

  const handleGameRoomSelect = (roomId: string) => {
    setCurrentGameRoomId(roomId);
    setCurrentScreen('multiplayerGame');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleBackToGameRooms = () => {
    setCurrentGameRoomId(null);
    setCurrentScreen('gameRooms');
  };

  // Atualizar moedas do usuário
  const handleUpdateCoins = (newAmount: number) => {
    setUserCoins(newAmount);
    // Aqui você pode adicionar uma chamada para o serviço de usuário para atualizar no banco de dados
  };

  // Exibir tela de carregamento
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  // Exibir tela de erro com opção para diagnóstico
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHelp}>
          Certifique-se de que as credenciais do Firebase estão configuradas corretamente em src/config/firebaseConfig.ts
        </Text>
        <TouchableOpacity 
          style={styles.diagnosticButton}
          onPress={() => {
            setError(null);
            setCurrentScreen('diagnostic');
          }}
        >
          <Text style={styles.diagnosticButtonText}>Executar Diagnóstico</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determinar qual tela exibir
  let screenToShow;
  switch (currentScreen) {
    case 'login':
      screenToShow = (
        <LoginScreen 
          onLogin={() => setCurrentScreen('menu')} 
          onRegister={() => setCurrentScreen('register')}
          onDiagnostic={() => setCurrentScreen('diagnostic')}
        />
      );
      break;
    case 'register':
      screenToShow = (
        <RegisterScreen 
          onRegisterSuccess={() => setCurrentScreen('login')} 
          onBackToLogin={() => setCurrentScreen('login')}
        />
      );
      break;
    case 'menu':
      screenToShow = (
        <MenuScreen 
          userCoins={userCoins}
          userProfile={userProfile}
          onCoinsUpdated={handleUpdateCoins}
          onNavigate={handleNavigate}
          onLogout={() => auth.signOut()}
        />
      );
      break;
    case 'rooms':
      screenToShow = (
        <RoomsScreen 
          onRoomSelect={handleRoomSelect}
          onBackToMenu={handleBackToMenu}
          userCoins={userCoins}
          userProfile={userProfile}
        />
      );
      break;
    case 'game':
      screenToShow = (
        <GameScreen 
          onLogout={() => auth.signOut()}
          onBackToMenu={handleBackToMenu}
          roomId={currentRoomId}
          userCoins={userCoins}
          userProfile={userProfile}
        />
      );
      break;
    case 'diagnostic':
      screenToShow = (
        <DiagnosticScreen
          onBackToMenu={handleBackToMenu}
        />
      );
      break;
    case 'tasks':
      screenToShow = (
        <TasksScreen 
          userProfile={userProfile}
          onCoinsUpdated={handleUpdateCoins}
          onBackToMenu={handleBackToMenu}
        />
      );
      break;
    case 'profile':
    case 'shop':
      screenToShow = (
        <ShopScreen 
          userProfile={userProfile}
          userCoins={userCoins}
          onCoinsUpdated={handleUpdateCoins}
          onBackToMenu={handleBackToMenu}
        />
      );
      break;
    case 'invites':
      screenToShow = (
        <InvitesScreen
          userProfile={userProfile}
          onBackToMenu={handleBackToMenu}
        />
      );
      break;
    case 'gameRooms':
      screenToShow = (
        <GameRoomsScreen
          userProfile={userProfile}
          onRoomSelect={handleGameRoomSelect}
          onBackToMenu={handleBackToMenu}
        />
      );
      break;
    case 'multiplayerGame':
      screenToShow = (
        <MultiplayerGameScreen
          roomId={currentGameRoomId || ''}
          userProfile={userProfile}
          onBackToRooms={handleBackToGameRooms}
        />
      );
      break;
    default:
      screenToShow = (
        <LoginScreen 
          onLogin={() => setCurrentScreen('menu')} 
          onRegister={() => setCurrentScreen('register')}
        />
      );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        {screenToShow}
        
        {/* Botão flutuante para diagnóstico (apenas em desenvolvimento) */}
        {__DEV__ && currentScreen !== 'diagnostic' && (
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={() => setCurrentScreen('diagnostic')}
          >
            <Text style={styles.floatingButtonText}>Diag</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    fontSize: 18,
    color: '#f1faee',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e63946',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f1faee',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorHelp: {
    fontSize: 14,
    color: '#a8dadc',
    textAlign: 'center',
    marginBottom: 30,
  },
  diagnosticButton: {
    backgroundColor: '#457b9d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  diagnosticButtonText: {
    color: '#f1faee',
    fontWeight: 'bold',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e63946',
    marginBottom: 20,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#f1faee',
    textAlign: 'center',
    marginBottom: 30,
  },
  backLink: {
    fontSize: 16,
    color: '#457b9d',
    textDecorationLine: 'underline',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(69, 123, 157, 0.8)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: '#f1faee',
    fontWeight: 'bold',
  },
}); 