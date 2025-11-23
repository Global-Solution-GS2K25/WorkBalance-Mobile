# WorkBalance App

Aplicativo mobile para monitoramento de bem-estar e equilíbrio entre vida pessoal e profissional.

## 📱 Sobre o Projeto

O WorkBalance é um aplicativo React Native desenvolvido com Expo que permite aos usuários registrar e acompanhar seu bem-estar através de check-ins diários. O app funciona completamente offline e sincroniza automaticamente quando há conexão com a internet.

## ✨ Funcionalidades

- **Autenticação**: Login e registro de usuários
- **Check-ins**: Registro de humor, nível de estresse e qualidade do sono
- **Histórico**: Visualização de todos os check-ins registrados
- **Conteúdos**: Dicas rápidas de bem-estar e equilíbrio
- **Modo Offline**: Funciona completamente sem internet
- **Sincronização Automática**: Sincroniza dados quando online

## 🚀 Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- AsyncStorage
- Axios
- NetInfo

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd workbalance-app
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## 🎯 Como Usar

1. Faça login ou crie uma conta
2. Registre seu primeiro check-in informando:
   - Humor (1-5)
   - Nível de estresse (1-5)
   - Qualidade do sono (1-5)
   - Sintomas físicos (opcional)
   - Observações (opcional)
3. Acompanhe seu histórico na seção "Minha Jornada"
4. Explore dicas de bem-estar na seção "Conteúdos"

## 📝 Estrutura do Projeto

```
workbalance-app/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos React
│   ├── navigation/     # Configuração de navegação
│   ├── screens/        # Telas do aplicativo
│   ├── services/       # Serviços de API e armazenamento
│   └── theme/          # Design system
├── assets/             # Imagens e ícones
└── App.js              # Componente principal
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa no navegador

## 🎨 Design

O aplicativo utiliza um design moderno com tema dark mode, incluindo:
- Paleta de cores escura e elegante
- Gradientes sutis nos fundos
- Componentes com bordas arredondadas
- Tipografia clara e legível
- Animações suaves e transições

## 🔐 Segurança

- Dados armazenados localmente com AsyncStorage
- Sincronização segura com API quando online
- Tokens de autenticação gerenciados pelo AuthContext

## 🌐 Suporte Offline

O aplicativo foi desenvolvido com foco em funcionamento offline:
- Todos os dados são salvos localmente primeiro
- Sincronização acontece em background quando há conexão
- Usuário não precisa se preocupar com status de conexão
- Dados são preservados mesmo sem internet

## 🐛 Troubleshooting

### Problemas comuns:

1. **Erro ao iniciar o servidor**
   - Limpe o cache: `npx expo start --clear`
   - Reinstale as dependências: `rm -rf node_modules && npm install`

2. **Problemas de sincronização**
   - Verifique sua conexão com a internet
   - Os dados são salvos localmente, então não há perda de informação

3. **Erro de navegação**
   - Certifique-se de estar logado para acessar as telas internas

## 📽️ Vídeo

https://youtu.be/3yaXkD1Iv1I  

## 👥 Autores

- **Juan Pablo Rebelo Coelho** - RM: 560445
- **Maria Eduarda Fernandes Rocha** - RM: 560657
- **Victor de Carvalho Alves** - RM: 560395

## 📄 Licença

Este projeto foi desenvolvido como parte do trabalho acadêmico da FIAP - Global Solution 2025.