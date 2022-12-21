const TEACHING_API_BAZA = "na952";
const SENSEI_RACUN = "0xd1B109f0A38FcB5C0e44F9a37EA5E4881f62E350";

let SENSEI_BC_RPC_URL = "https://sensei.lavbic.net:8546";
let TEACHING_API_BASE_URL =
  "https://teaching.lavbic.net/api/OIS/baza/" + TEACHING_API_BAZA + "/podatki/";
let prijavljenRacun;


  let scenariji = {
    "903f28c4-51e7-49c4-a813-ddfd0339c928": {
      ime: "Jan",
      priimek: "Novak",
      datumRojstva: "1965-03-04",
      portfolio:   [[
        {
          valuta: "aave",
          am: "563.235",
        },{
          valuta: "matic-network",
          am: "76433.234",
        },{
          valuta: "enjincoin",
          am: "33992.978"
        },{
          valuta: "ethereum",
          am: "10"
        },{
          valuta: "avalanche-2",
          am: "102.993",
        },{
          valuta: "bitcoin",
          am: "1.23",
        }]]
    },
    "9a3bb943-394b-4567-9d62-d3f986254b1b": {
      ime: "Tinkara",
      priimek: "Kotnik",
      datumRojstva: "2000-06-01",
      portfolio: [[
        {
          valuta: "bitcoin",
          am: "0.23462",
        },{
          valuta: "ethereum",
          am: "2.24654",
        },{
          valuta: "tether",
          am: "3345.24"
        },{
          valuta: "waves",
          am: "399.24"
        },{
          valuta: "polkadot",
          am: "99.62"
        }]]
    },
    "55326a1c-4213-4d8b-92a7-c0a99837d890": {
      ime: "Luka",
      priimek: "Golob",
      datumRojstva: "1994-07-02",
      portfolio: [[
        {
          valuta: "terra-luna",
          am: "87.275",
        },{
          valuta: "avalanche-2",
          am: "99.788",
        },{
          valuta: "solana",
          am: "65.5443"
        },{
          valuta: "apecoin",
          am: "345.23453"
        },{
          valuta: "shiba-inu",
          am: "96999999.00"
        },{
          valuta: "decentraland",
          am: "3253.653"
        }]]
    }
  }
  
/**
 * Generator podatkov za novega uporabnika, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati nov scenarij s specifičnimi
 * podatki, ki se nanašajo na scenarij.
 *
 * @param stScenarija zaporedna številka scenarija (1, 2 ali 3)
 * @return scenarijId generiranega scenarija
 */
function generirajScenarij(stScenarija) {
  let scenarijId = Object.keys(scenariji)[stScenarija-1]

  fetch('https://teaching.lavbic.net/api/OIS/baza/na952/podatki/azuriraj?kljuc=' + scenarijId + '&elementTabele=false',{
  method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(scenariji[scenarijId]) 
  })
  .then(res => {
    console.log(res)
  })

  // TODO: Potrebno implementirati
  return scenarijId;
}

// TODO: Tukaj implementirate funkcionalnosti, ki jo podpira vaša aplikacija
let web3;
let coins;


fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily")
  .then(res => res.json())
  .then(data => {
  let prices = data.prices
  drawChart(prices, "Bitcoin")
  })

function generirajID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


function getCoins(id){
  fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc")
  .then(res => res.json())
  .then(data => {
    coins = data
    console.log(data)
    data.forEach(valuta => {
      $(`#${id} #valuta`).append(`<option value="${valuta.id}">${valuta.symbol.toUpperCase()}</option>`);
    });
    dodajPolje(true)
    dodajPolje(true)
    dodajPolje(true)
  })
}
getCoins()

  function roundToNearestHour(date) {
    date.setMinutes(date.getMinutes() + 30);
    date.setMinutes(0, 0, 0);
  
    return date;
  } 

  function generirajScenarije(){
    let obvestilo = []
    obvestilo.push(generirajScenarij(1))
    obvestilo.push(generirajScenarij(2))
    obvestilo.push(generirajScenarij(3))
    alert(`Generirani scenariji z ID-ji: \n ${obvestilo[0]} \n ${obvestilo[1]}\n ${obvestilo[2]}`)
  }

  function ikone(idPolja){
      let id = $(`#${idPolja} #valuta`).val()
      if($(`#${idPolja} #valuta`).val() == ""){
        $(`#${idPolja} #kol img`).remove()
      }
      coins.forEach((coin, j) => {
      if(coin.id == id){
        $(`#${idPolja} #kol img`).remove()
        $(`#${idPolja} #kol`).append(`<img src="${coins[j].image}" alt="coin" class="input-group-text"style=" height: 31px;"/>`)
      }
    })
  }


  $(document).ready(() => {
    web3 = new Web3(SENSEI_BC_RPC_URL)
    poslusalciModalnaOkna()

    $("#scenarijNovUporabnik").on("change", function() {
      let uporabnik = $(this).val().split(",")
      $("#ime").val(uporabnik[0])
      $("#priimek").val(uporabnik[1])
      $("#datumRojstva").val(uporabnik[2])
    })

    $("#portfolijUporabnik").on("change", function() {
      $("#poljaValute div").remove()
      let id = $(this).val()
      $("#vnosPortfolijaId").val(id)
      let portfolio = scenariji[id].portfolio[scenariji[id].portfolio.length -1]
      for(let i = 0; i < portfolio.length; i++){
            let id = dodajPolje()
            $(`#${id} #valuta`).val(portfolio[i].valuta)
            $(`#${id} #kolicina`).val(portfolio[i].am)
            ikone(id)
      }
    })
    $("#grafPortfolija").on("change", function() {
      let id = $(this).val()
      $("#grafPortfolijaId").val(id)
    })
    $("#preberiUporabnika").on("change", function() {
      let id = $(this).val()
      $("#preberiUporabnikaId").val(id)
    })

    $("#poljaValute").on("change", function()  {
      let polja = $("#poljaValute").find(".polje")
      for(let i = 0 ; i<polja.length; i++){
        ikone(polja[i].id)
      }
    })
})

function dodajPortfolio(){
  let id = $("#vnosPortfolijaId").val()
  let p = []
  let valute = $("#vnosPortfolija #valuta").each(function(i) {
    let kolicina = []
    $("#vnosPortfolija #kolicina").each(function(j) {
      kolicina.push($(this).val())
    })
    if($(this).val() != "" && kolicina[i] > 0){
      p.push({
        valuta: $(this).val(),
        am: kolicina[i]
      })
    }
  })
  fetch(`https://teaching.lavbic.net/api/OIS/baza/na952/podatki/azuriraj?kljuc=${id}|portfolio&elementTabele=true`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(p) 
  })
  .then(res => console.log(res))
}

function preberiUporabnika() {
  let id = $("#preberiUporabnikaId").val()
  fetch(`https://teaching.lavbic.net/api/OIS/baza/na952/podatki/vrni/${id}`)
  .then(res => res.json())
  .then(data => {
    $("#preberiSporocilo").html(`<div style="text-align: center;" class="border border-dark">Uporabniku je ime ${data.ime}  
    ${data.priimek} <br> in je rojen/a ${data.datumRojstva}</div>`)
  })
}

function registrirajUporabnika(){
  let ime = $("#ime").val()
  let priimek = $("#priimek").val()
  let datumRojstva = $("#datumRojstva").val()
  let id = generirajID();
  let uporabnik = {
    ime: ime,
    priimek: priimek,
    datumRojstva: datumRojstva
  }
  fetch(`https://teaching.lavbic.net/api/OIS/baza/na952/podatki/azuriraj?kljuc=${id}&elementTabele=false`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(uporabnik) 
  });
  $("#kreirajSporocilo").html(`<div style="text-align: center;" class="border border-dark mt-3">${ime}  
  ${priimek} je dodan/a.<br>
  ID: ${id}</div>`)
}

function dodajPolje(noOffset){
  id = generirajID()
  $("#poljaValute").append(`<div id="${id}" class="polje rounded mb-3" style="border-width: thick; border-style: solid; border-color: #CCCCCC; display: grid;">
  <div style="width: 100%; padding: 5px;">
    <span class="badge bg-secondary">Kriptovaluta</span>
    <div class="input-group input-group-sm">
      <select class="form-select form-select-sm" id="valuta">
        <option value="">Izberi kriptovaluto...</option>
      </select>
    </div>
    <span class="badge bg-secondary">Količina</span>
    <div class="input-group input-group-sm" id="kol">
      <input 
      id="kolicina"
      type="number" 
      class="form-control form-control-sm mb-2"
      placeholder="Vnesi količino kriptovalute...">
    </div>
  </div>
  <button class="btn bg-danger btn-sm text-light mb-2" style="margin:auto;"onClick="zbrisiPolje('${id}')">Odstrani</button>
</div>`)
  coins.forEach(valuta => {
    $(`#${id} #valuta`).append(`<option value="${valuta.id}">${valuta.symbol.toUpperCase()}</option>`);
  });
  if(!noOffset){
    $("html, body").animate({
      scrollTop: $(`#${id}`).offset().top - $("#vnosPortfolija").offset().top
    }, 10);
  }
  return id
}

function zbrisiPolje(id){
  $(`#${id}`).remove()
}

async function prikaziGraf(){
  let id = $("#grafPortfolijaId").val()
  let res = await fetch(`https://teaching.lavbic.net/api/OIS/baza/na952/podatki/vrni/${id}`)
  let data = await res.json()
  let len = data.portfolio.length - 1
  let podatki = data.portfolio[len]
  let cene = []

  for(let i = 0; i < podatki.length; i++){
    let res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${podatki[i].valuta}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`)
    let data = await res.json()
    let res2 = await fetch(`https://api.coingecko.com/api/v3/coins/${podatki[i].valuta}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false
    `)
    let data2 = await res2.json()
    let name = data2.symbol.toUpperCase()
    cene.push({sym: name, name: data2.id, vrednost: data[podatki[i].valuta].usd * podatki[i].am, desc: data2.description.en})
  }
  let napis = data.ime + ' ' + data.priimek
  drawDonutChart(cene, napis)
  prikazujVrednost(podatki)
  clearTimeout(timeout)
}


let timeout;
let g = 1;
async function prikazujVrednost(podatki){
  let cene = 0
  for(let i = 0; i < podatki.length; i++){
    let res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${podatki[i].valuta}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`)
    data = await res.json()
    cene += (data[podatki[i].valuta].usd * podatki[i].am)
  }
  cene = Math.round(cene * 100) / 100
  $("#prikazVrednosti").html(`$${cene.toLocaleString("de-DE")}`)
  if(g != 0){
    $("html, body").animate({
      scrollTop: $(
        'html, body').get(0).scrollHeight
    }, 5);
    g = 0;
  }
  timeout = setTimeout(function(){ prikazujVrednost(podatki); }, 10000)
}

function drawChart(prices, name){
  let dataPoints = [];

    prices.forEach(price => {
      let time = new Date(price[0])
      let cena = Math.round(price[1] * 100) / 100
      dataPoints.push({x: time, y: cena})
    })

    var chart = new CanvasJS.Chart("chartContainer",
  {
    theme:"light2",
    backgroundColor:"#EEEEEE",
    animationEnabled: true,
    zoomEnabled: true,
    title:{
      text: name
  },
  axisX:{
      title: "Čas",
      gridThickness: 2
  },
  axisY: {
      title: "Vrednost v dolarjih"
  },
  data: [
  {        
		type: "area",
    dataPoints: dataPoints
  }
  ]
});

  chart.render();
}

function drawDonutChart(prices, napis){
  let dataPoints = [];

    prices.forEach(price => {
      let cena = Math.round(price.vrednost * 100) / 100
      let name = price.name.charAt(0).toUpperCase() + price.name.slice(1)
      dataPoints.push({y: cena, label: price.sym, desc: price.desc, name: name})
    })

    var chart = new CanvasJS.Chart("chartContainer",
  {
    theme:"light2",
    animationEnabled:true,
    title:{
      text: napis
    },
    theme:"light2",
    backgroundColor:"#EEEEEE",
  data: [{
		type: "doughnut",
    click:onClick,
		startAngle: 60,
		indexLabelFontSize: 17,
		indexLabel: "{label} - #percent%",
		toolTipContent: "<b>{label}:</b> {y} (#percent%)",
		dataPoints: dataPoints
	}]
});

  chart.render();

  function onClick(e) {
    $("#description").html(`<h4>${e.dataPoint.name}</h4>${e.dataPoint.desc}`)
    $("html, body").animate({
      scrollTop: $(
        'html, body').get(0).scrollHeight
    }, 10);
	}
}


//Ethereum



const dopolniTabeloVseckov = async () => {
  try {
      let steviloBlokov = (await web3.eth.getBlock("latest")).number;
      let st = 1;
      $("#seznam-donacij").html("");
      let res = await fetch("https://teaching.lavbic.net/api/OIS/baza/na952/podatki/vrni/vsecki")
      let data = await res.json()

      for (let i = 0; i < data.length; i++) {
        let vsecek = data[i]
          if (vsecek.prejemnik != null && vsecek.posiljatelj != null && vsecek.kolicina > 0) {
              $("#seznam-donacij").append("\
              <tr>\
                  <th scope='row'>" + st++ + "</th>\
                  <td>" + vsecek.posiljatelj + "</td>\
                  <td>" + vsecek.kolicina + " <i class='fa-brands fa-ethereum'></i></td>\
              </tr>");
            }
        }
  } catch (e) {
      alert(e);
  }
};

const donirajEthereum = async (modalnoOknoDoniraj) => {
  try {
      var posiljateljDenarnica = $("#eth-racun").attr("denarnica");
      var prejemnikDenarnica = $("#denarnica-prejemnika").val();
      var amount = $("#ocena").val();

      let rezultat = await web3.eth.sendTransaction({
          from: posiljateljDenarnica,
          to: prejemnikDenarnica,
          value: amount * Math.pow(10, 18),
      });
      
      let zaBazo = {
        posiljatelj: posiljateljDenarnica,
        prejemnik: SENSEI_RACUN,
        kolicina: amount
      }

      // ob uspešni prijavi računa
      if (rezultat) {
          modalnoOknoDoniraj.hide();
          fetch('https://teaching.lavbic.net/api/OIS/baza/na952/podatki/azuriraj?kljuc=vsecki&elementTabele=true',{
          method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(zaBazo) 
          })
          .then(res => {
            console.log(res)
          })
      } else {
          // neuspešna prijava računa
          $("#napakaVseckanje").html(
              "<div class='alert alert-danger' role='alert'>" +
              "<i class='fas fa-exclamation-triangle me-2'></i>" +
              "Prišlo je do napake pri transakciji!" +
              "</div>"
          );
      }
  } catch (e) {
      // napaka pri prijavi računa
      $("#napakaVseckanje").html(
          "<div class='alert alert-danger' role='alert'>" +
          "<i class='fas fa-exclamation-triangle me-2'></i>" +
          "Prišlo je do napake pri transakciji: " + e +
          "</div>"
      );
  }
};


function okrajsajNaslov(vrednost) {
  if(vrednost != null)
  return vrednost.substring(0, 4) + "..." + vrednost.substring(vrednost.length - 3, vrednost.length);
}

const prijavaEthereumDenarnice = async () => {
  $("#napakaPrijava").html("")
  try {
      let rezultat = await web3.eth.personal.unlockAccount(
          $("#denarnica").val(),
          $("#geslo").val(),
          300);

      // ob uspešni prijavi računa
      if (rezultat) {
          prijavljenRacun = $("#denarnica").val();
          $("#eth-racun").html(okrajsajNaslov($("#denarnica").val()) + " (5 min)");
          $("#eth-racun").attr("denarnica", $("#denarnica").val());
          $("#gumb-vseckanje").removeAttr("disabled");
      } else {
          // neuspešna prijava računa
          $("#napakaPrijava").html(
              "<div class='alert alert-danger' role='alert'>" +
              "<i class='fas fa-exclamation-triangle me-2'></i>" +
              "Prišlo je do napake pri odklepanju!" +
              "</div>"
          );
      }
  } catch (napaka) {
      // napaka pri prijavi računa
      $("#napakaPrijava").html(
          "<div class='alert alert-danger' role='alert'>" +
          "<i class='fas fa-exclamation-triangle me-2'></i>" +
          "Prišlo je do napake pri odklepanju: " + napaka +
          "</div>"
      );

  }
};

function poslusalciModalnaOkna() {
  const modalnoOknoDoniraj = new bootstrap.Modal(document.getElementById("modalno-okno-donacije"), {
      backdrop: 'static'
  });

  $("#denarnica,#geslo").keyup(function (e) {
      if ($("#denarnica").val().length > 0 && $("#geslo").val().length > 0){
          $("#gumb-potrdi-prijavo").removeAttr("disabled");
      }
      else
          $("#gumb-potrdi-prijavo").attr("disabled", "disabled");
  });

  $("#gumb-potrdi-prijavo").click(function (e) {
      prijavaEthereumDenarnice();
  });

  $("#potrdi-donacijo").click(function (e) {
      donirajEthereum(modalnoOknoDoniraj);
  });

  $("#gumb-vseckanje").click(function () {

  })

  var modalnoOknoDonacije = document.getElementById('modalno-okno-donacije');
  modalnoOknoDonacije.addEventListener('show.bs.modal', function (event) {
    console.log("dd")
      var prijavljenaDenarnica = $("#eth-racun").attr("denarnica");
      $("#posiljatelj").text(prijavljenaDenarnica);
      $("#prejemnik").text(SENSEI_RACUN)
  });

  var modalnoOknoSeznamDonacij = document.getElementById('modalno-okno-seznam-donacij');
  modalnoOknoSeznamDonacij.addEventListener('show.bs.modal', function (event) {
      dopolniTabeloVseckov();
  });
}