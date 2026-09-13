/* =========================================================
   TREINO SÍTIO DE MAINHA
   APP.JS
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const PIX_KEY = "12876564807";

const PIX_NAME = "MIRIAN TAVARES DA SILVA";

/*
    O campo cidade do PIX aceita até 15 caracteres.

    Vitória de Santo Antão foi abreviado para:
    VITORIA STO ANT
*/
const PIX_CITY = "VITORIA STO ANT";



// Depois que publicarmos o Google Apps Script,
//coloque aqui a URL terminada em /exec.

//Exemplo:

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxDwIqSRQCmWuyuCKm1IZilPezSt1stdn6OIpXHLqQOKfEY5sdnMmRtJCoQ9eaqXNWB/exec";




/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const nav =
    document.getElementById("nav");

const optionButtons =
    document.querySelectorAll(".escolher-opcao");

const opcao =
    document.getElementById("opcao");

const pixValor =
    document.getElementById("pixValor");

const pixChave =
    document.getElementById("pixChave");

const copiarChave =
    document.getElementById("copiarChave");

const qrCodeElement =
    document.getElementById("qrcode");

const pixCopiaCola =
    document.getElementById("pixCopiaCola");

const copiarPixButton =
    document.getElementById("copiarPix");

const telefone =
    document.getElementById("telefone");

const formInscricao =
    document.getElementById("formInscricao");

const comprovante =
    document.getElementById("comprovante");

const formMessage =
    document.getElementById("formMessage");

const confirmacao =
    document.getElementById("confirmacao");

const numeroPeito =
    document.getElementById("numeroPeito");

const fecharConfirmacao =
    document.getElementById("fecharConfirmacao");

const header =
    document.querySelector(".header");


/* =========================================================
   MENU MOBILE
========================================================= */

if (menuToggle && nav) {

    menuToggle.addEventListener(
        "click",
        () => {

            nav.classList.toggle("active");

        }
    );


    nav.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove("active");

                }
            );

        });

}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function formatEMV(id, value) {

    const length =
        String(value.length)
            .padStart(2, "0");

    return id + length + value;

}


function sanitizePixText(
    text,
    maxLength
) {

    return String(text)
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^A-Za-z0-9 ]/g,
            ""
        )
        .toUpperCase()
        .substring(
            0,
            maxLength
        );

}


/* =========================================================
   CRC16 PIX
========================================================= */

function crc16(payload) {

    let crc = 0xFFFF;

    for (
        let i = 0;
        i < payload.length;
        i++
    ) {

        crc ^=
            payload.charCodeAt(i)
            << 8;


        for (
            let j = 0;
            j < 8;
            j++
        ) {

            if (
                (crc & 0x8000)
                !== 0
            ) {

                crc =
                    (crc << 1)
                    ^ 0x1021;

            }

            else {

                crc =
                    crc << 1;

            }

            crc &= 0xFFFF;

        }

    }


    return crc
        .toString(16)
        .toUpperCase()
        .padStart(4, "0");

}


/* =========================================================
   GERAR PIX COPIA E COLA
========================================================= */

function gerarPix(valor) {

    const merchantName =
        sanitizePixText(
            PIX_NAME,
            25
        );


    const merchantCity =
        sanitizePixText(
            PIX_CITY,
            15
        );


    /*
        Merchant Account Information
    */

    const merchantAccount =

        formatEMV(
            "00",
            "br.gov.bcb.pix"
        )

        +

        formatEMV(
            "01",
            PIX_KEY
        );


    let payload = "";


    /*
        00
        Payload Format Indicator
    */

    payload +=
        formatEMV(
            "00",
            "01"
        );


    /*
        26
        Merchant Account Information
    */

    payload +=
        formatEMV(
            "26",
            merchantAccount
        );


    /*
        52
        Merchant Category Code
    */

    payload +=
        formatEMV(
            "52",
            "0000"
        );


    /*
        53
        Moeda:
        986 = Real brasileiro
    */

    payload +=
        formatEMV(
            "53",
            "986"
        );


    /*
        54
        Valor
    */

    payload +=
        formatEMV(
            "54",
            Number(valor)
                .toFixed(2)
        );


    /*
        58
        País
    */

    payload +=
        formatEMV(
            "58",
            "BR"
        );


    /*
        59
        Nome
    */

    payload +=
        formatEMV(
            "59",
            merchantName
        );


    /*
        60
        Cidade
    */

    payload +=
        formatEMV(
            "60",
            merchantCity
        );


    /*
        62
        Additional Data
        Transaction ID
    */

    const additionalData =
        formatEMV(
            "05",
            "***"
        );


    payload +=
        formatEMV(
            "62",
            additionalData
        );


    /*
        Campo CRC
    */

    payload += "6304";


    /*
        Calcula CRC final
    */

    payload +=
        crc16(payload);


    return payload;

}


/* =========================================================
   RETORNA VALOR DA OPÇÃO
========================================================= */

function getOptionValue() {

    if (!opcao) {

        return 0;

    }


    if (
        opcao.value
        === "estrutura"
    ) {

        return 50;

    }


    if (
        opcao.value
        === "transporte"
    ) {

        return 110;

    }


    return 0;

}


/* =========================================================
   DESCRIÇÃO DA OPÇÃO
========================================================= */

function getOptionDescription() {

    if (!opcao) {

        return "";

    }


    if (
        opcao.value
        === "estrutura"
    ) {

        return "Evento + Estrutura";

    }


    if (
        opcao.value
        === "transporte"
    ) {

        return "Evento + Transporte";

    }


    return "";

}


/* =========================================================
   ATUALIZA PIX E QR CODE
========================================================= */

function atualizarPixAutomatico() {

    const valor =
        getOptionValue();


    /*
        Nenhuma opção selecionada
    */

    if (!valor) {

        if (pixValor) {

            pixValor.textContent =
                "Selecione uma opção";

        }


        if (pixCopiaCola) {

            pixCopiaCola.value = "";

        }


        if (qrCodeElement) {

            qrCodeElement.innerHTML =
                "";

        }


        return;

    }


    /*
        Atualiza valor mostrado
    */

    if (pixValor) {

        pixValor.textContent =
            valor.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }


    /*
        Gera PIX
    */

    const pixPayload =
        gerarPix(valor);


    /*
        PIX Copia e Cola
    */

    if (pixCopiaCola) {

        pixCopiaCola.value =
            pixPayload;

    }


    /*
        QR Code
    */

    if (qrCodeElement) {

        qrCodeElement.innerHTML = "";


        /*
            Verifica se biblioteca
            QRCode está carregada
        */

        if (
            typeof QRCode
            !== "undefined"
        ) {

            new QRCode(
                qrCodeElement,
                {

                    text:
                        pixPayload,

                    width:
                        200,

                    height:
                        200,

                    correctLevel:
                        QRCode.CorrectLevel.M

                }
            );

        }

        else {

            qrCodeElement.innerHTML =
                `
                <p>
                    Não foi possível
                    carregar o QR Code.
                </p>
                `;

            console.error(
                "Biblioteca QRCode não carregada."
            );

        }

    }

}


/* =========================================================
   BOTÕES ESCOLHER OPÇÃO
========================================================= */

optionButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (!opcao) {

                    return;

                }


                /*
                    Seleciona a opção
                    no formulário
                */

                opcao.value =
                    button.dataset.opcao;


                /*
                    Atualiza QR e PIX
                */

                atualizarPixAutomatico();


                /*
                    Vai até formulário
                */

                const formArea =
                    document.getElementById(
                        "formInscricao"
                    );


                if (formArea) {

                    formArea.scrollIntoView(
                        {
                            behavior:
                                "smooth",

                            block:
                                "center"
                        }
                    );

                }

            }
        );

    }
);


/* =========================================================
   TROCA MANUAL DA OPÇÃO
========================================================= */

if (opcao) {

    opcao.addEventListener(
        "change",
        atualizarPixAutomatico
    );

}


/* =========================================================
   COPIAR CHAVE PIX
========================================================= */

if (
    copiarChave
    && pixChave
) {

    copiarChave.addEventListener(
        "click",
        async () => {

            try {

                await navigator
                    .clipboard
                    .writeText(
                        PIX_KEY
                    );


                const original =
                    copiarChave.innerHTML;


                copiarChave.innerHTML =
                    `
                    <i class="fa-solid fa-check"></i>
                    Copiado!
                    `;


                setTimeout(
                    () => {

                        copiarChave.innerHTML =
                            original;

                    },
                    2000
                );

            }

            catch (error) {

                console.error(
                    error
                );


                alert(
                    "Chave PIX: "
                    + PIX_KEY
                );

            }

        }
    );

}


/* =========================================================
   COPIAR PIX COPIA E COLA
========================================================= */

if (
    copiarPixButton
    && pixCopiaCola
) {

    copiarPixButton.addEventListener(
        "click",
        async () => {

            const codigo =
                pixCopiaCola.value.trim();


            if (!codigo) {

                alert(
                    "Selecione primeiro uma opção de inscrição."
                );

                return;

            }


            try {

                await navigator
                    .clipboard
                    .writeText(
                        codigo
                    );


                const original =
                    copiarPixButton.innerHTML;


                copiarPixButton.innerHTML =
                    `
                    <i class="fa-solid fa-check"></i>
                    PIX copiado!
                    `;


                setTimeout(
                    () => {

                        copiarPixButton.innerHTML =
                            original;

                    },
                    2000
                );

            }

            catch (error) {

                /*
                    Alternativa para
                    navegadores antigos
                */

                pixCopiaCola.select();

                document.execCommand(
                    "copy"
                );


                alert(
                    "PIX copiado."
                );

            }

        }
    );

}


/* =========================================================
   MÁSCARA DE TELEFONE
========================================================= */

function formatPhone(value) {

    let digits =
        value.replace(
            /\D/g,
            ""
        );


    /*
        Limita a 11 dígitos
    */

    digits =
        digits.substring(
            0,
            11
        );


    /*
        Celular
        81999999999
    */

    if (
        digits.length
        > 10
    ) {

        return digits.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );

    }


    /*
        Telefone fixo
    */

    if (
        digits.length
        > 6
    ) {

        return digits.replace(
            /(\d{2})(\d{4})(\d{0,4})/,
            "($1) $2-$3"
        );

    }


    if (
        digits.length
        > 2
    ) {

        return digits.replace(
            /(\d{2})(\d+)/,
            "($1) $2"
        );

    }


    if (
        digits.length
        > 0
    ) {

        return "(" + digits;

    }


    return "";

}


if (telefone) {

    telefone.addEventListener(
        "input",
        () => {

            telefone.value =
                formatPhone(
                    telefone.value
                );

        }
    );

}


/* =========================================================
   NORMALIZA TELEFONE
========================================================= */

function normalizePhone(value) {

    let phone =
        String(value)
            .replace(
                /\D/g,
                ""
            );


    /*
        Remove código do Brasil
        caso seja informado.

        +55 81...
    */

    if (
        phone.startsWith("55")
        && phone.length > 11
    ) {

        phone =
            phone.substring(2);

    }


    return phone;

}


/* =========================================================
   COMPROVANTE
========================================================= */

if (comprovante) {

    comprovante.addEventListener(
        "change",
        () => {

            const file =
                comprovante.files[0];


            /*
                Procura elemento de texto
                dentro da área de upload
            */

            const uploadArea =
                comprovante.closest(
                    ".upload-area"
                );


            const textElement =
                uploadArea
                    ?.querySelector(
                        "strong"
                    );


            if (
                file
                && textElement
            ) {

                textElement.textContent =
                    file.name;

            }

        }
    );

}


/* =========================================================
   VALIDAR COMPROVANTE
========================================================= */

function validateProof(file) {

    if (!file) {

        return {
            valid: false,
            message:
                "Envie o comprovante do pagamento."
        };

    }


    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "application/pdf"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        return {
            valid: false,
            message:
                "Envie o comprovante em JPG, PNG ou PDF."
        };

    }


    /*
        Máximo 5MB
    */

    const maxSize =
        5
        * 1024
        * 1024;


    if (
        file.size
        > maxSize
    ) {

        return {
            valid: false,
            message:
                "O comprovante deve ter no máximo 5 MB."
        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   CONVERTER ARQUIVO PARA BASE64
========================================================= */

function fileToBase64(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    const result =
                        reader.result;


                    /*
                        Remove:

                        data:image/jpeg;base64,
                    */

                    const base64 =
                        result
                            .split(",")[1];


                    resolve(base64);

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   MENSAGEM DO FORMULÁRIO
========================================================= */

function showFormMessage(
    message,
    type = "info"
) {

    if (!formMessage) {

        return;

    }


    formMessage.textContent =
        message;


    if (
        type === "error"
    ) {

        formMessage.style.color =
            "#C62828";

    }

    else if (
        type === "success"
    ) {

        formMessage.style.color =
            "#2E7D32";

    }

    else {

        formMessage.style.color =
            "#3258A6";

    }

}


/* =========================================================
   CONFIRMAÇÃO
========================================================= */

function showConfirmation(
    numero
) {

    if (
        !confirmacao
        || !numeroPeito
    ) {

        return;

    }


    numeroPeito.textContent =
        numero;


    confirmacao.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR CONFIRMAÇÃO
========================================================= */

function closeConfirmation() {

    if (!confirmacao) {

        return;

    }


    confirmacao.hidden =
        true;


    document.body.style.overflow =
        "";

}


if (fecharConfirmacao) {

    fecharConfirmacao.addEventListener(
        "click",
        closeConfirmation
    );

}


if (confirmacao) {

    confirmacao.addEventListener(
        "click",
        event => {

            if (
                event.target
                === confirmacao
            ) {

                closeConfirmation();

            }

        }
    );

}


/* =========================================================
   ENVIO DO FORMULÁRIO
========================================================= */

if (formInscricao) {

    formInscricao.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /*
                Dados
            */

            const nomeInput =
                document.getElementById(
                    "nome"
                );


            const nome =
                nomeInput
                    ?.value
                    .trim()
                || "";


            const telefoneNormalizado =
                normalizePhone(
                    telefone?.value
                    || ""
                );


            const selectedOption =
                opcao?.value
                || "";


            /*
                Valida nome
            */

            if (
                nome.length
                < 3
            ) {

                showFormMessage(
                    "Digite seu nome completo.",
                    "error"
                );

                nomeInput?.focus();

                return;

            }


            /*
                Valida telefone
            */

            if (
                telefoneNormalizado.length
                !== 10
                &&
                telefoneNormalizado.length
                !== 11
            ) {

                showFormMessage(
                    "Informe um telefone válido com DDD.",
                    "error"
                );

                telefone?.focus();

                return;

            }


            /*
                Valida opção
            */

            if (!selectedOption) {

                showFormMessage(
                    "Escolha uma opção de inscrição.",
                    "error"
                );

                opcao?.focus();

                return;

            }


            /*
                Comprovante
            */

            const file =
                comprovante
                    ?.files[0];


            const validation =
                validateProof(
                    file
                );


            if (
                !validation.valid
            ) {

                showFormMessage(
                    validation.message,
                    "error"
                );

                return;

            }


            /*
                Valores
            */

            const value =
                getOptionValue();


            const optionDescription =
                getOptionDescription();


            /*
                Mensagem
            */

            showFormMessage(
                "Enviando sua inscrição...",
                "info"
            );


            /*
                Desabilita botão
            */

            const submitButton =
                formInscricao.querySelector(
                    'button[type="submit"]'
                );


            const submitOriginalText =
                submitButton
                    ?.innerHTML;


            if (submitButton) {

                submitButton.disabled =
                    true;


                submitButton.innerHTML =
                    `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Enviando...
                    `;

            }


            try {

                /*
                    Arquivo Base64
                */

                const proofBase64 =
                    await fileToBase64(
                        file
                    );


                /*
                    Payload
                */

                const payload = {

                    nome:
                        nome,

                    telefone:
                        telefoneNormalizado,

                    opcao:
                        optionDescription,

                    valor:
                        value,

                    comprovante: {

                        nome:
                            file.name,

                        tipo:
                            file.type,

                        base64:
                            proofBase64

                    }

                };


                /*
                    Enquanto Google Apps Script
                    ainda não estiver configurado
                */

                if (!SCRIPT_URL) {

                    console.log(
                        "Inscrição pronta para envio:",
                        payload
                    );


                    showFormMessage(
                        "Formulário funcionando. Falta apenas conectar ao Google Sheets.",
                        "info"
                    );


                    return;

                }


                /*
                    Envio ao Apps Script
                */

                const response =
                    await fetch(
                        SCRIPT_URL,
                        {

                            method:
                                "POST",

                            headers:
                            {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify(
                                    payload
                                )

                        }
                    );


                /*
                    Resposta JSON
                */

                const result =
                    await response.json();


                /*
                    Telefone duplicado
                */

                if (
                    result.status
                    === "duplicado"
                ) {

                    showFormMessage(
                        "Já existe uma inscrição cadastrada com este telefone.",
                        "error"
                    );

                    return;

                }


                /*
                    Sucesso
                */

                if (
                    result.status
                    === "sucesso"
                ) {

                    showFormMessage(
                        "Inscrição realizada com sucesso!",
                        "success"
                    );


                    /*
                        Número SMxxx
                    */

                    showConfirmation(
                        result.numero
                    );


                    /*
                        Limpa formulário
                    */

                    formInscricao.reset();


                    /*
                        Limpa QR
                    */

                    atualizarPixAutomatico();


                    /*
                        Restaura texto do upload
                    */

                    const uploadArea =
                        comprovante
                            ?.closest(
                                ".upload-area"
                            );


                    const uploadStrong =
                        uploadArea
                            ?.querySelector(
                                "strong"
                            );


                    if (uploadStrong) {

                        uploadStrong.textContent =
                            "Enviar comprovante";

                    }


                    return;

                }


                /*
                    Erro retornado
                    pelo servidor
                */

                throw new Error(
                    result.message
                    ||
                    "Não foi possível concluir a inscrição."
                );

            }

            catch (error) {

                console.error(
                    "Erro na inscrição:",
                    error
                );


                showFormMessage(
                    "Não foi possível enviar a inscrição. Tente novamente.",
                    "error"
                );

            }

            finally {

                /*
                    Reativa botão
                */

                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML =
                        submitOriginalText;

                }

            }

        }
    );

}


/* =========================================================
   HEADER AO ROLAR A PÁGINA
========================================================= */

function updateHeader() {

    if (!header) {

        return;

    }


    if (
        window.scrollY
        > 50
    ) {

        header.style.background =
            "rgba(13, 13, 13, 0.92)";

    }

    else {

        header.style.background =
            "rgba(13, 13, 13, 0.45)";

    }

}


window.addEventListener(
    "scroll",
    updateHeader
);


updateHeader();


/* =========================================================
   INICIALIZA PIX
========================================================= */

atualizarPixAutomatico();