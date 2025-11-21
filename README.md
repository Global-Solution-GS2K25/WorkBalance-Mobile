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

## 📄 Licença

Este projeto é privado.

