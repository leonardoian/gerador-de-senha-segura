# 🔐 Gerador de Senha Segura

Um gerador de senhas forte e seguro, construído com HTML, CSS e JavaScript puro — sem dependências externas.

![preview](https://img.shields.io/badge/status-concluído-brightgreen) ![license](https://img.shields.io/badge/licença-MIT-blue)

---

## Demonstração

Abra o arquivo `index.html` diretamente no navegador. Nenhuma instalação ou servidor necessário.

---

## Funcionalidades

- **Geração criptograficamente segura** com `crypto.getRandomValues()` (Web Crypto API)
- **Controle de comprimento** de 6 a 64 caracteres via slider
- **Tipos de caracteres configuráveis:**
  - Maiúsculas (A–Z)
  - Minúsculas (a–z)
  - Números (0–9)
  - Símbolos (!@#$%^&*...)
  - Exclusão de caracteres similares (0, O, l, 1, I)
- **Indicador de força** baseado em entropia de Shannon (bits)
- **Garantia de diversidade** — ao menos um caractere de cada categoria ativa é incluído
- **Sem viés estatístico** — embaralhamento Fisher-Yates com rejection sampling
- **Copiar com um clique** — Clipboard API com fallback para navegadores antigos
- **Interface moderna** com glassmorphism, 100% responsiva

---

## Níveis de Força

| Nível        | Entropia       | Cor        |
|--------------|---------------|------------|
| Muito Fraca  | < 36 bits     | Vermelho   |
| Fraca        | 36 – 59 bits  | Laranja    |
| Razoável     | 60 – 79 bits  | Amarelo    |
| Forte        | 80 – 99 bits  | Verde      |
| Muito Forte  | ≥ 100 bits    | Roxo       |

> A entropia é calculada como: `comprimento × log₂(tamanho do alfabeto)`

---

## Estrutura do Projeto

```
gerador-de-senha-segura/
├── index.html   # Estrutura da interface
├── style.css    # Estilização (glassmorphism, responsivo)
├── script.js    # Lógica de geração e segurança
└── README.md
```

---

## Como Usar

1. Clone ou baixe este repositório
2. Abra `index.html` no seu navegador
3. Configure as opções desejadas
4. Clique em **Gerar Senha**
5. Clique no ícone de cópia para copiar a senha

---

## Segurança

Este projeto utiliza exclusivamente a **Web Crypto API** (`crypto.getRandomValues`), que fornece números aleatórios criptograficamente seguros — ao contrário de `Math.random()`, que é previsível e inadequado para geração de senhas.

O embaralhamento utiliza o algoritmo **Fisher-Yates** com **rejection sampling** para eliminar viés estatístico que ocorre com o uso direto do operador módulo (`%`).

---

## Tecnologias

- HTML5
- CSS3 (Custom Properties, Flexbox, Backdrop Filter)
- JavaScript ES2020+ (Web Crypto API, Clipboard API)

---

## Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
