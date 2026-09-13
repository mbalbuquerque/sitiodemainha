# 🏃 Treino Sítio de Mainha

Site oficial de divulgação e inscrições para o **Treino Sítio de Mainha**.

A aplicação foi desenvolvida como uma solução web simples, responsiva e integrada ao ecossistema Google para gerenciamento das inscrições, comprovantes de pagamento e numeração dos participantes.

---

## 📌 Sobre o evento

O **Treino Sítio de Mainha** é uma experiência esportiva que reúne atividade física, natureza e confraternização.

O evento conta com:

- 🏅 Premiação
- 📸 Fotos profissionais
- ☕ Café da manhã regional pós-treino
- 🌳 Ambiente integrado à natureza
- 🚌 Opção de transporte para os participantes

---

## 💰 Inscrições

### Opção 01 — Evento + Estrutura

**Valor: R$ 50,00**

O participante utiliza transporte próprio e tem acesso à inscrição e à estrutura disponibilizada no evento.

### Opção 02 — Evento + Transporte

**Valor: R$ 110,00**

Inclui inscrição, estrutura do evento e transporte de ida e volta a partir do ponto de encontro previamente definido.

---

## 💳 Pagamento

O pagamento é realizado via **PIX**.

O próprio site gera automaticamente:

- QR Code PIX
- PIX Copia e Cola
- Valor correspondente à opção selecionada

Após realizar o pagamento, o participante envia o comprovante pelo formulário de inscrição.

---

## 📝 Dados solicitados

Para manter o processo de inscrição simples, são solicitados apenas:

- Nome
- Telefone
- Opção de inscrição
- Comprovante de pagamento

Os comprovantes aceitos são:

- JPG
- JPEG
- PNG
- PDF

---

## 🔢 Numeração dos participantes

Cada inscrição confirmada pelo sistema recebe automaticamente um identificador único:

```text
SM001
SM002
SM003
SM004
...
```

A numeração é sequencial.

Números anteriormente utilizados não devem ser reutilizados, inclusive quando uma inscrição for posteriormente cancelada.

---

## 🏗️ Arquitetura

A aplicação utiliza uma arquitetura simples:

```text
Participante
     │
     ▼
HTML / CSS / JavaScript
     │
     ▼
Google Apps Script
     │
     ├──────────────► Google Sheets
     │                  Inscrições
     │
     └──────────────► Google Drive
                        Comprovantes
```

O navegador não possui acesso direto à planilha ou à pasta de comprovantes.

O **Google Apps Script** funciona como backend da aplicação.

---

## 🛠️ Tecnologias utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript
- Font Awesome
- QRCode.js

### Backend / Serviços

- Google Apps Script
- Google Sheets
- Google Drive

### Versionamento

- Git
- GitHub

---

## 📁 Estrutura do projeto

```text
treino-sitio-mainha/
│
├── index.html
├── README.md
├── .gitignore
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
└── img/
    ├── logo.png
    ├── 01.jpeg
    ├── 02.jpeg
    ├── 03.jpeg
    ├── 04.jpeg
    ├── 05.jpeg
    ├── 06.jpeg
    └── galeria/
```

---

## 📊 Google Sheets

As inscrições são armazenadas em uma planilha com a seguinte estrutura:

| Numero | Data/Hora | Nome | Telefone | Opcao | Valor | Comprovante | Status |
|---|---|---|---|---|---|---|---|

O status inicial de uma nova inscrição é:

```text
Pendente
```

---

## 📂 Google Drive

Os comprovantes enviados pelos participantes são armazenados em uma pasta privada no Google Drive.

A pasta não deve ser configurada como pública.

Somente pessoas autorizadas pela organização devem possuir acesso aos comprovantes.

---

## 🔐 Segurança

A aplicação utiliza validações tanto no navegador quanto no backend.

> Validações JavaScript executadas no navegador são utilizadas para melhorar a experiência do usuário e não devem ser consideradas um mecanismo de segurança.

As validações críticas são realizadas novamente no Google Apps Script.

Entre as medidas implementadas estão:

- Validação dos campos no backend
- Validação da opção de inscrição
- Validação do valor correspondente à opção
- Verificação de telefone duplicado
- Normalização do telefone
- Controle da geração sequencial das inscrições
- Uso de `LockService` para evitar conflitos simultâneos
- Restrição dos formatos de comprovantes
- Limitação do tamanho dos arquivos
- Armazenamento privado dos comprovantes

### Próximas melhorias de segurança

Estão previstas:

- Rate limiting
- Honeypot contra bots
- Proteção adicional contra inscrições automatizadas
- Reforço da validação de uploads
- Tratamento seguro das mensagens de erro
- Monitoramento de tentativas abusivas

---

## ⚠️ Dados sensíveis

Nunca devem ser enviados ao repositório:

```text
.env
credentials.json
service-account.json
token.json
client_secret.json
*.pem
*.key
```

Esses arquivos estão contemplados no `.gitignore`.

Credenciais, tokens, senhas ou chaves privadas nunca devem ser inseridos diretamente no código-fonte.

---

## 🚀 Executando localmente

Por ser um projeto HTML/CSS/JavaScript, pode ser executado utilizando uma extensão como **Live Server** no VS Code.

Também é possível utilizar outro servidor HTTP local.

Após iniciar o servidor, acesse o endereço informado pelo ambiente local.

---

## 🧪 Antes de publicar

Recomenda-se realizar os seguintes testes:

1. Realizar uma inscrição válida.
2. Confirmar a geração do número `SMxxx`.
3. Verificar a inclusão da inscrição no Google Sheets.
4. Confirmar o upload do comprovante no Google Drive.
5. Tentar realizar nova inscrição com o mesmo telefone.
6. Testar as duas opções e seus respectivos valores.
7. Testar PIX Copia e Cola.
8. Testar QR Code PIX.
9. Testar o site em celular e desktop.
10. Verificar se nenhum arquivo sensível está sendo versionado.

---

## 📱 Responsividade

O site foi desenvolvido para funcionar em:

- Smartphones
- Tablets
- Notebooks
- Desktops

A interface utiliza layout responsivo e adapta menus, imagens, formulário, botões e demais componentes conforme o tamanho da tela.

---

## 📞 Contato

Para informações relacionadas ao evento, utilize o botão de WhatsApp disponível no site.

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para o **Treino Sítio de Mainha**.

Tecnologias:

`HTML` • `CSS` • `JavaScript` • `Google Apps Script` • `Google Sheets` • `Google Drive`

---

## 📄 Licença

Este projeto foi desenvolvido especificamente para utilização no **Treino Sítio de Mainha**.

O conteúdo visual, identidade do evento, fotografias e demais materiais associados devem ser utilizados somente com autorização de seus respectivos responsáveis.