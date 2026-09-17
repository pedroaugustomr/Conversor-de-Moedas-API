const convertButton = document.querySelector(".convert-button")

const currencySelect = document.querySelector(".currency-select")

const currencySelectFrom = document.querySelector(".currency-select-from")

const inputCurrency = document.querySelector(".input-currency")


// ==================================================
// MOEDAS
// ==================================================

const moedas = {

    real: {
        codigo: "BRL",
        nome: "Real Brasileiro",
        simbolo: "R$",
        imagem: "./assets/real.png"
    },

    dolar: {
        codigo: "USD",
        nome: "Dólar Americano",
        simbolo: "US$",
        imagem: "./assets/dolar.png"
    },

    euro: {
        codigo: "EUR",
        nome: "Euro",
        simbolo: "€",
        imagem: "./assets/euro.png"
    },

    libra: {
        codigo: "GBP",
        nome: "Libra Esterlina",
        simbolo: "£",
        imagem: "./assets/libra.png"
    },

    iene: {
        codigo: "JPY",
        nome: "Iene Japonês",
        simbolo: "¥",
        imagem: "./assets/iene.png"
    },

    bitcoin: {
        codigo: "BTC",
        nome: "Bitcoin",
        simbolo: "₿",
        imagem: "./assets/bitcoin.png"
    }

}


// ==================================================
// TAXAS
// ==================================================

//  taxas daS APIs.

let taxas = {

    BRL: 1,
    USD: 0,
    EUR: 0,
    GBP: 0,
    JPY: 0,
    BTC: 0

}


// ==================================================
// COTAÇÕES
// ==================================================

async function buscarCotacoes() {

    try {

        console.log("Buscando cotações...")


        // ----------------------------------------------
        // FRANKFURTER(API)
        // ----------------------------------------------

        const respostaMoedas = await fetch(
            "https://api.frankfurter.dev/v2/rates?base=BRL&quotes=USD,EUR,GBP,JPY"
        )


        if (!respostaMoedas.ok) {

            throw new Error(
                "Erro ao buscar moedas tradicionais."
            )

        }


        const dadosMoedas = await respostaMoedas.json()


        console.log("Cotações Frankfurter:", dadosMoedas)


        // ----------------------------------------------
        // CONVERTE A RESPOSTA DA API PARA NOSSO OBJETO
        // ----------------------------------------------

        dadosMoedas.forEach(item => {

            // A API retorna, por exemplo:
            //
            // {
            //     base: "BRL",
            //     quote: "USD",
            //     rate: 0.19
            // }

            // Como queremos saber quanto vale
            // 1 unidade da moeda em BRL,
            // precisamos inverter a taxa.

            taxas[item.quote] = 1 / item.rate

        })


        // ----------------------------------------------
        // BITCOIN
        // ----------------------------------------------

        const respostaBitcoin = await fetch(
            "https://api.coinbase.com/v2/prices/BTC-USD/spot"
        )


        if (!respostaBitcoin.ok) {

            throw new Error(
                "Erro ao buscar cotação do Bitcoin."
            )

        }


        const dadosBitcoin = await respostaBitcoin.json()


        console.log("Cotação Bitcoin:", dadosBitcoin)


        const bitcoinEmDolar =
            Number(dadosBitcoin.data.amount)


        // Quanto vale 1 USD em BRL?

        const dolarEmReal = taxas.USD


        // BTC → USD → BRL

        taxas.BTC =
            bitcoinEmDolar * dolarEmReal


        console.log("Taxas finais:", taxas)


        console.log("Cotações atualizadas!")

    }

    catch (error) {

        console.error(
            "Não foi possível atualizar as cotações:",
            error
        )

    }

}


// ==================================================
// FORMATAR VALOR
// ==================================================

function formatarValor(valor, moeda) {


    // Bitcoin

    if (moeda.codigo === "BTC") {

        return `₿ ${valor.toLocaleString("pt-BR", {

            minimumFractionDigits: 2,

            maximumFractionDigits: 8

        })}`

    }


    // Moedas tradicionais

    return new Intl.NumberFormat("pt-BR", {

        style: "currency",

        currency: moeda.codigo

    }).format(valor)

}


// ==================================================
// CONVERTER VALORES
// ==================================================

function convertValues() {

    const from = currencySelectFrom.value

    const to = currencySelect.value


    const inputCurrencyValue =
        Number(inputCurrency.value)


    const currencyValueToConvert =
        document.querySelector(
            ".currency-value-to-convert"
        )


    const currencyValueConverted =
        document.querySelector(
            ".currency-value"
        )


    // ----------------------------------------------
    // VERIFICA SE AS COTAÇÕES FORAM CARREGADAS
    // ----------------------------------------------

    if (
        taxas.USD === 0 ||
        taxas.EUR === 0 ||
        taxas.GBP === 0 ||
        taxas.JPY === 0 ||
        taxas.BTC === 0
    ) {

        currencyValueConverted.innerHTML =
            "Carregando cotações..."

        return

    }


    // ----------------------------------------------
    // VERIFICA O VALOR DIGITADO
    // ----------------------------------------------

    if (
        isNaN(inputCurrencyValue) ||
        inputCurrencyValue <= 0
    ) {

        currencyValueToConvert.innerHTML =
            formatarValor(
                0,
                moedas[from]
            )


        currencyValueConverted.innerHTML =
            formatarValor(
                0,
                moedas[to]
            )


        return

    }


    // ----------------------------------------------
    // TAXA DE ORIGEM
    // ----------------------------------------------

    const taxaOrigem =
        taxas[moedas[from].codigo]


    // ----------------------------------------------
    // TAXA DE DESTINO
    // ----------------------------------------------

    const taxaDestino =
        taxas[moedas[to].codigo]


    // ----------------------------------------------
    // CONVERSÃO
    // ----------------------------------------------

    const result =
        inputCurrencyValue *
        taxaOrigem /
        taxaDestino


    // ----------------------------------------------
    // MOSTRA VALOR ORIGINAL
    // ----------------------------------------------

    currencyValueToConvert.innerHTML =
        formatarValor(
            inputCurrencyValue,
            moedas[from]
        )


    // ----------------------------------------------
    // MOSTRA VALOR CONVERTIDO
    // ----------------------------------------------

    currencyValueConverted.innerHTML =
        formatarValor(
            result,
            moedas[to]
        )


    console.log("Valor:", inputCurrencyValue)

    console.log("De:", from)

    console.log("Para:", to)

    console.log("Taxa origem:", taxaOrigem)

    console.log("Taxa destino:", taxaDestino)

    console.log("Resultado:", result)

}


// ==================================================
// TROCAR MOEDA
// ==================================================

function changeCurrency() {


    const from =
        currencySelectFrom.value


    const to =
        currencySelect.value


    // ----------------------------------------------
    // MOEDA DE ORIGEM
    // ----------------------------------------------

    const currencyNameToConvert =
        document.querySelector(
            ".currency-name-to-convert"
        )


    const currencyImageToConvert =
        document.querySelector(
            ".currency-img-to-convert"
        )


    // ----------------------------------------------
    // MOEDA DE DESTINO
    // ----------------------------------------------

    const currencyName =
        document.querySelector(
            "#currency-name"
        )


    const currencyImage =
        document.querySelector(
            ".currency-img"
        )


    // ----------------------------------------------
    // ATUALIZA ORIGEM
    // ----------------------------------------------

    currencyNameToConvert.innerHTML =
        moedas[from].nome


    currencyImageToConvert.src =
        moedas[from].imagem


    // ----------------------------------------------
    // ATUALIZA DESTINO
    // ----------------------------------------------

    currencyName.innerHTML =
        moedas[to].nome


    currencyImage.src =
        moedas[to].imagem


    // ----------------------------------------------
    // ATUALIZA VALORES
    // ----------------------------------------------

    convertValues()

}


// ==================================================
// EVENTOS
// ==================================================


// Selecionou uma moeda de origem

currencySelectFrom.addEventListener(
    "change",
    changeCurrency
)


// Selecionou uma moeda de destino

currencySelect.addEventListener(
    "change",
    changeCurrency
)


// Clicou em converter

convertButton.addEventListener(
    "click",
    convertValues
)


// ==================================================
// INICIA O SITE
// ==================================================

// Assim que o site abre,
// busca as cotações automaticamente.

buscarCotacoes()