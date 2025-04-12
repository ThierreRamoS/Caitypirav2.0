# Caitypira

Um jogo multiplataforma de apostas com dados, desenvolvido com React Native e Firebase.

## Tecnologias Utilizadas

- **Frontend**: React Native + Expo
- **Backend**: Firebase (Authentication, Firestore, Realtime Database)
- **Linguagem**: TypeScript

## Funcionalidades

- Autenticação de usuários
- Sistema de salas de jogo
- Apostas em tempo real
- Diferentes níveis de assinatura
- Sistema de moeda virtual "CaityCoins"
- Estatísticas de jogador
- Sistema de tarefas e missões diárias com recompensas
- Loja de itens virtuais personalizados

## Regras do Jogo

Caitypira é um jogo de apostas com dados que segue as seguintes regras:

1. O jogador escolhe um número de 1 a 6 e uma seção (Vermelho ou Preto)
1. São lançados três dados: um vermelho e dois brancos
1. Condições para ganhar:
   - Na seção Vermelho:
     - O dado vermelho deve corresponder ao número apostado
     - Se 1 dado branco corresponder: ganho de 1x o valor apostado
     - Se 2 dados brancos corresponderem: ganho de 5x o valor apostado
   - Na seção Preto:
     - O dado vermelho deve corresponder ao número apostado
     - Se nenhum dado branco corresponder: ganho de 1x o valor apostado
     - Se todos os dados corresponderem: ganho de 4x o valor apostado

## Níveis de Assinatura

- **Free**: Acesso básico ao jogo
- **Bronze**: Recursos adicionais, sem anúncios
- **Silver**: Bônus diários de CaityCoins
- **Gold**: Todas as vantagens anteriores + recursos exclusivos

## Instalação e Execução

### Pré-requisitos

- Node.js
- Expo CLI
- Firebase

### Configuração

1. Instale as dependências: `npm install`
2. Configure suas credenciais do Firebase em `src/config/firebaseConfig.ts` (você precisará criar este arquivo).
3. Execute o aplicativo: `npx expo start`

### Desenvolvimento Local com Emuladores Firebase

Para desenvolver localmente sem precisar de um projeto Firebase real, você pode usar os emuladores do Firebase:

1. **Instale o Firebase CLI**: 
   ```
   npm install -g firebase-tools
   ```

2. **Execute o ambiente de desenvolvimento completo**:
   ```
   npm run dev
   ```

Este comando irá:
- Iniciar os emuladores de Authentication e Firestore
- Criar automaticamente um usuário de teste e salas de exemplo
- Iniciar o aplicativo Expo

**Credenciais de teste:**
- Email: teste@exemplo.com
- Senha: senha123

**Interface do Emulador:**
Acesse http://localhost:4000 para visualizar e gerenciar os dados dos emuladores.

### Configuração Detalhada do Firebase

Para que o Caitypira funcione corretamente, você precisa configurar o Firebase seguindo estas etapas:

1. **Criar um projeto no Firebase**:
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Clique em "Adicionar projeto" e siga as instruções
   - Dê um nome ao seu projeto (ex: "caitypira")

2. **Configurar a Autenticação**:
   - No console do Firebase, vá para "Authentication" no menu lateral
   - Clique em "Começar" e depois em "Sign-in method"
   - Ative o método "Email/senha"

3. **Configurar o Firestore Database**:
   - No console do Firebase, vá para "Firestore Database" no menu lateral
   - Clique em "Criar banco de dados"
   - Escolha o modo (recomendado: iniciar em modo de teste)
   - Selecione a região do servidor mais próxima de você

4. **Configurar as Regras do Firestore**:
   - Na seção "Regras" do Firestore, adicione as seguintes regras:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth != null && request.auth.uid == userId;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       match /rooms/{roomId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. **Adicionar o Firebase ao seu aplicativo**:
   - No console do Firebase, clique na engrenagem (Configurações do projeto)
   - Clique em "Adicionar app" e selecione o ícone da web (</>) 
   - Registre o app com um apelido (ex: "caitypira-web")
   - Copie o objeto `firebaseConfig` fornecido

6. **Atualizar o arquivo de configuração**:
   - Abra o arquivo `src/config/firebaseConfig.ts`
   - Substitua o objeto `firebaseConfig` pelo que você copiou do console do Firebase

7. **Instalação de dependências específicas do Firebase**:
   - Execute: `npm install firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore`

Após completar essas etapas, o sistema de autenticação e banco de dados do Caitypira deve funcionar corretamente.

## Estrutura do Projeto

```bash
caitypira/
├── src/
│   ├── assets/        # Imagens, sons e outros recursos
│   ├── components/    # Componentes reutilizáveis
│   ├── config/        # Configurações (Firebase, etc.)
│   ├── hooks/         # Custom hooks
│   ├── navigation/    # Configuração de navegação
│   ├── screens/       # Telas do aplicativo
│   ├── services/      # Serviços (auth, game, etc.)
│   └── utils/         # Funções utilitárias
├── .gitignore         # Arquivos ignorados pelo Git
├── App.tsx            # Ponto de entrada do aplicativo
├── package.json       # Dependências
└── README.md          # Este arquivo
```

## Próximos Passos

- [ ] Implementar chat de áudio em tempo real
- [ ] Adicionar sistema de convites por ID/telefone
- [ ] Desenvolver tela de torneios
- [x] Implementar sistema de missões diárias
- [x] Adicionar loja de itens virtuais

## Autor

[TorGroup] - [contato@torgroup.pt] 