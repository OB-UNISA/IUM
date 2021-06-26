function customOnLoadCentro () {
  // Event listener searchBar
  const searchButton = document.getElementById('searchButton')
  const searchInput = document.getElementById('searchInput')
  searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value
    fillList(inputValue)
  })
  searchInput.addEventListener('input', () => {
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
  const nomeImmagine = document.getElementById('immagineAnimale')
  const nomeImmagineModal = document.getElementById('immagineAnimaleModal')

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

      // per scegliere foto giusta
      let nomeImmagineString
      switch (animale.specie.toLowerCase()) {
        case 'lupo':
          nomeImmagineString = '/assets/media/lupo.jpg'
          break
        case 'cane':
          nomeImmagineString = '/assets/media/cane.jpg'
          break
        case 'gatto':
          nomeImmagineString = '/assets/media/gatto.jpg'
          break
        case 'cinghiale':
          nomeImmagineString = '/assets/media/cinghiale.jpg'
          break
        default:
          nomeImmagineString = '/assets/media/20820a81a70a4bd79f5fa77e1efa5d33.png'
          break
      }
      nomeImmagine.removeAttribute('src')
      nomeImmagine.setAttribute('src', nomeImmagineString)

      nomeImmagineModal.removeAttribute('src')
      nomeImmagineModal.setAttribute('src', nomeImmagineString)

      // setto mappa
      mapboxgl.accessToken = 'pk.eyJ1IjoieWFudCIsImEiOiJja3FjeWZ1bzcwMmZqMnFwZ3I1b2d0dzFmIn0.PlX5QglV9zgy3oI8ILOtaw'
      const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken })
      mapboxClient.geocoding.forwardGeocode({
        query: animale.luogoRitrovamento,
        autocomplete: false,
        limit: 1
      })
        .send()
        .then(function (response) {
          if (response && response.body && response.body.features && response.body.features.length) {
            const feature = response.body.features[0]
            const map = new mapboxgl.Map({
              container: 'mappaDiv',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: feature.center,
              zoom: 15
            })
            map.addControl(new mapboxgl.FullscreenControl())
            map.addControl(new mapboxgl.NavigationControl())
            // creo marker
            new mapboxgl.Marker().setLngLat(feature.center).addTo(map)
          }
        }) // fine mappa
    } // fine success
  }) // fine chiamata AJAX
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
    // nomeImmagine: nomeImmagine,
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
        if (searchInput == '' || animale.luogoRitrovamento.toLowerCase().includes(searchInput.toLowerCase()) || animale.specie.toLowerCase() == searchInput.toLowerCase()) {
          createListEntry(myList, animale)
        }
      })
    }
  })
}
