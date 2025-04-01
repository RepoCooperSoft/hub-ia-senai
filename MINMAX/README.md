# 🎮 Jogo da Velha com IA (Minmax)

Implementação do clássico Jogo da Velha com inteligência artificial usando o algoritmo Minmax em JavaScript puro.

## 🌟 Funcionalidades

- **Escolha de jogador**: Jogue como X (primeiro) ou O (segundo)
- **IA invencível**: Implementação do algoritmo Minmax
- **Interface simples**: Design limpo e intuitivo
- **Responsivo**: Funciona em dispositivos móveis e desktop

## 🚀 Como Jogar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Escolha com qual símbolo deseja jogar (X ou O)
3. Clique em qualquer célula vazia para fazer sua jogada
4. A IA responderá automaticamente
5. Para reiniciar, clique no botão "Reiniciar Jogo"

## ⚙️ Tecnologias Utilizadas

- HTML5
- CSS3 (Grid Layout)
- JavaScript puro (ES6)
- Algoritmo Minmax

## 🤖 Sobre a IA

A inteligência artificial utiliza o algoritmo **Minmax** para:
- Nunca perder (sempre garante pelo menos o empate)
- Aproveitar qualquer erro do jogador humano para vencer
- Avaliar todas as possibilidades de jogo até o final

## 📊 Estrutura do Código

```plaintext
📂 jogo-da-velha/
├── index.html          # Página principal com HTML/CSS/JS
├── README.md           # Este arquivo
```

## 🛠️ Personalização

Você pode modificar:
- **Cores**: Alterar no CSS dentro da tag `<style>`
- **Dificuldade**: Ajustar a profundidade do Minmax (atualmente configurado para perfeição)
- **Tamanho do tabuleiro**: Modificar as dimensões no CSS

## 📱 Compatibilidade

Testado e funcionando em:
- Chrome, Firefox, Edge, Safari
- Dispositivos móveis (Android/iOS)

## 📜 Licença

Este projeto está licenciado sob a licença MIT.