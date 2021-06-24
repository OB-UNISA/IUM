function customOnLoadCentro () {
  // Event listener searchBar
  const searchButton = document.getElementById('searchButton')
  const searchInput = document.getElementById('searchInput')
  searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value
    fillList(inputValue)
  })

  // Event listener per bottone inserimento animali
  const dashboard = document.getElementById('dashboard')
  const inserisciAnimaleButton = document.getElementById('bottoneInserisciAnimale')
  const inserisciAnimaleForm = document.getElementById('formInserimento')

  inserisciAnimaleButton.addEventListener('click', () => {
    const allAElements = Array.prototype.slice.call(document.getElementsByTagName('a')) // thanks stackoverflow xoxo
    allAElements.forEach((element) => {
      element.classList.remove('active')
    })
    dashboard.style.display = 'none'
    inserisciAnimaleForm.style.display = 'block'
  })

  fillList('')
}

// per visualizzare dettagli
function onListElementClick (idAnimale) {
  // rendo non active tutti gli elementi della lista
  const allAElements = Array.prototype.slice.call(document.getElementsByTagName('a')) // thanks stackoverflow xoxo
  allAElements.forEach((element) => {
    element.classList.remove('active')
  })

  // nascondo form inserimento
  const inserisciAnimaleForm = document.getElementById('formInserimento')
  inserisciAnimaleForm.style.display = 'none'

  // rendo visibile la dashboard
  const dashboard = document.getElementById('dashboard')
  dashboard.style.display = 'block'
  dashboard.style.visibility = 'visible'

  // rendo active l'elemento che ho cliccato
  const aElement = document.getElementById(idAnimale)
  aElement.classList.add('active')

  // elementi da riempire
  const id = document.getElementById('idAnimale')
  const specie = document.getElementById('specie')
  const eta = document.getElementById('eta')
  const data = document.getElementById('data')
  const luogo = document.getElementById('luogo')
  const autoctono = document.getElementById('autoctono')
  const recuperabile = document.getElementById('recuperabile')
  const carFisiche = document.getElementById('carFisiche')
  const malattie = document.getElementById('malattie')
  const ferite = document.getElementById('ferite')

  // recupero dal database dettagli animale
  $.ajax({
    url: './animali/getAnimaleDetails',
    data: { id: idAnimale },
    contentType: 'json',
    type: 'GET',
    timeout: 5000,
    success: function (animale) {
      // riempio
      id.value = animale.id
      specie.value = animale.specie
      eta.value = animale.eta
      data.value = animale.dataRitrovamento
      luogo.value = animale.luogoRitrovamento
      autoctono.value = animale.autoctono
      recuperabile.value = animale.recuperabile
      carFisiche.value = animale.caratteristicheFisiche
      malattie.value = animale.malattie
      ferite.value = animale.ferite
    }
  })
}

function insertAnimale () {
  const specie = document.getElementById('specieInput').value
  const eta = document.getElementById('etaInput').value
  const data = moment(document.getElementById('dataInput').value, 'YYYY-MM-DD').format('DD/MM/YYYY')
  const luogo = document.getElementById('luogoInput').value
  const autoctono = document.getElementById('autoctonoInput').value
  const recuperabile = document.getElementById('recuperabileInput').value
  const carFisiche = document.getElementById('carFisicheInput').value
  const malattie = document.getElementById('malattieInput').value
  const ferite = document.getElementById('feriteInput').value

  const myAnimal = {
    specie: specie,
    eta: eta,
    dataRitrovamento: data,
    luogoRitrovamento: luogo,
    autoctono: autoctono,
    recuperabile: recuperabile,
    caratteristicheFisiche: carFisiche,
    malattie: malattie,
    ferite: ferite
  }

  $.ajax({
    url: './animali/setAnimal',
    type: 'POST',
    data: JSON.stringify(myAnimal),
    contentType: 'application/json; charset=utf-8',
    timeout: 5000,
    success: function (users) {
      window.location.replace('/centro')
    }
  })
}

function deleteAnimale () {
  const idAnimale = document.getElementById('idAnimale').value

  $.ajax({
    url: './animali/deleteAnimal',
    type: 'GET',
    data: { id: idAnimale },
    contentType: 'json',
    timeout: 5000,
    success: function (users) {
      window.location.replace('/centro')
    }
  })
}

function createListEntry (myList, animale) {
  const myDiv = document.createElement('div')
  myDiv.innerHTML = "<a onclick='onListElementClick(" + animale.id + ")' id='" + animale.id + "' class='list-group-item list-group-item-action py-3 lh-tight' aria-current='true'><div class='d-flex w-100 align-items-center justify-content-between'><strong id='titoloAnimale' class='mb-1'>" + animale.specie + "</strong><small id='dataPreview'>" + animale.dataRitrovamento + "</small></div><div id='luogoPreview' class='col-10 mb-1 small'>" + animale.luogoRitrovamento + '</div></a>'
  myList.appendChild(myDiv)
}

function fillList (searchInput) {
  // Chiamo DB per ottenere tutti gli animali
  $.ajax({
    url: './animali/get',
    type: 'GET',
    timeout: 5000,
    success: function (animali) {
      // lista sidebar alla quale appendere tutti gli animali
      const myList = document.getElementById('listaSidebar')
      myList.innerHTML = ''

      // append di tutti gli animali ritornati dal database
      animali.forEach((animale, i) => {
        if (searchInput == '' || animale.luogoRitrovamento == searchInput) {
          createListEntry(myList, animale)
        }
      })
    }
  })
}
