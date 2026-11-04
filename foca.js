let letrasCorretas = [];
let letErrada = [];
let palavra = "";

const maxTentativas = 15;

let tentativasRestantes = maxTentativas;
let jogoAtivo = false;

const segredo = document.getElementById("segredo");
const categoria = document.getElementById("categoria");
const dica = document.getElementById("dica");

const tentativa = document.getElementById("tentativa");
const painel = document.getElementById("painel");

const btInicia = document.getElementById("btInicia");
const btVerifica = document.getElementById("btVerifica");

const erradas = document.getElementById("erradas");
const reset = document.getElementById("reset");

const tituloPag = document.getElementById("tituloPag");
const mensagem = document.getElementById("mensagem");

const contadorErros = document.getElementById("contadorErros");

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function habilitarBtInicio() {

    const palavraDigitada = segredo.value.trim();

    btInicia.disabled = palavraDigitada.length < 6;

}

function iniciarOJogo() {

    palavra = segredo.value.trim();

    if (normalizar(palavra).length < 6) {
        return;
    }

    letrasCorretas = [];
    letErrada = [];

    tentativasRestantes = maxTentativas;

    jogoAtivo = true;

    segredo.disabled = true;
    categoria.disabled = true;
    dica.disabled = true;

    btInicia.disabled = true;

    tentativa.disabled = false;
    btVerifica.disabled = false;

    tentativa.value = "";

    reset.hidden = true;



    tituloPag.innerHTML = "Desafio Secreto";

    tituloPag.style.color = "white";


    document.getElementById("categoriaExibida").innerText =
        categoria.value.trim() || "Surpresa";

    document.getElementById("dicaExibida").innerText =
        dica.value.trim() || "Descubra a palavra!";

    atualizarPainel();

    atualizarEnergia();

    atualizarErros();

    mensagem.innerHTML = "O desafio começou! Boa sorte!";

    tentativa.focus();

}

function atualizarPainel() {

    painel.innerHTML = "";

    const palavraNormalizada = normalizar(palavra);

    [...palavra].forEach((caractere, indice) => {

        const letraNormalizada = palavraNormalizada[indice];

        if (
            !/[a-z]/.test(letraNormalizada) ||
            letrasCorretas.includes(letraNormalizada)
        ) {

            painel.innerHTML += caractere.toUpperCase();

        } else {

            painel.innerHTML += "_";

        }

    });

}

function atualizarEnergia() {

    const barras = document.querySelectorAll(".barra");

    barras.forEach((barra, indice) => {

        if (indice >= tentativasRestantes) {

            barra.classList.add("perdida");

        } else {

            barra.classList.remove("perdida");

        }

    });

    contadorErros.innerHTML =
        tentativasRestantes + " tentativas restantes";

}

function atualizarErros() {

    erradas.innerHTML = letErrada.length > 0
        ? letErrada.map(letra => letra.toUpperCase()).join(", ")
        : "Nenhuma até agora";

}

function verificaLetraDigitada() {

    if (!jogoAtivo) return;

    const letra = normalizar(tentativa.value.trim());

    tentativa.value = "";

    if (!letra) return;

    if (letra.length !== 1 || !/[a-z]/.test(letra)) {

        mensagem.innerHTML = "Digite apenas uma letra!";

        tentativa.focus();

        return;

    }

    if (
        letrasCorretas.includes(letra) ||
        letErrada.includes(letra)
    ) {

        mensagem.innerHTML = "Você já tentou essa letra!";

        tentativa.focus();

        return;

    }

    const palavraNormalizada = normalizar(palavra);

    if (palavraNormalizada.includes(letra)) {

        letrasCorretas.push(letra);

        mensagem.innerHTML = "🎉 Muito bem! Você acertou!";

        mensagem.style.color = "#40d6a1";

        atualizarPainel();

    }

   
    else {

        letErrada.push(letra);

        tentativasRestantes--;

        mensagem.innerHTML =
            "❌ Ops! Você perdeu uma barrinha de energia!";

        mensagem.style.color = "#ff7185";


        atualizarEnergia();

        atualizarErros();

    }

    const venceu = [...palavraNormalizada].every(
        (letraPalavra, indice) => {

            return (
                !/[a-z]/.test(letraPalavra) ||
                letrasCorretas.includes(letraPalavra)
            );

        }
    );


    if (venceu) {

        finalizarJogo(true);

        return;

    }


    if (tentativasRestantes <= 0) {

        finalizarJogo(false);

        return;

    }

    tentativa.focus();

}

function finalizarJogo(venceu) {

    jogoAtivo = false;

    tentativa.disabled = true;

    btVerifica.disabled = true;


    reset.hidden = false;


    if (venceu) {

        tituloPag.innerHTML = "🏆 Você venceu!";

        tituloPag.style.color = "#40d6a1";

        mensagem.innerHTML =
            "Parabéns! Você descobriu a palavra: " +
            palavra.toUpperCase() + "!";

        mensagem.style.color = "#40d6a1";

    }

    else {

        tituloPag.innerHTML = "💔 Fim de jogo!";

        tituloPag.style.color = "#ff7185";

        mensagem.innerHTML =
            "Suas tentativas acabaram! A palavra era: " +
            palavra.toUpperCase();

        mensagem.style.color = "#ff7185";

        letrasCorretas = [
            ...new Set(
                [...normalizar(palavra)].filter(letra => /[a-z]/.test(letra))
            )
        ];

        atualizarPainel();

    }

}


function reiniciaJogo() {

    palavra = "";

    letrasCorretas = [];

    letErrada = [];

    tentativasRestantes = maxTentativas;

    jogoAtivo = false;

    segredo.disabled = false;
    categoria.disabled = false;
    dica.disabled = false;

    segredo.value = "";
    categoria.value = "";
    dica.value = "";

    tentativa.value = "";

    tentativa.disabled = true;

    btVerifica.disabled = true;

    btInicia.disabled = true;

    tituloPag.innerHTML = "Desafio Secreto";

    tituloPag.style.color = "white";

    painel.innerHTML = "_ _ _ _ _ _";

    document.getElementById("categoriaExibida").innerHTML =
        "Aguardando partida";

    document.getElementById("dicaExibida").innerHTML =
        "A dica aparecerá aqui";

    atualizarEnergia();

    atualizarErros();

    mensagem.innerHTML = "Comece o desafio para jogar!";

    mensagem.style.color = "#a9c2e1";

    reset.hidden = true;

    segredo.focus();

}