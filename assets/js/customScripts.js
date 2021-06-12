function customOnload () {
  const username = localStorage.getItem('username')
  if (username) {
    const loginButton = document.getElementById('loginButton')
    loginButton.innerHTML = username
    loginButton.onclick = undefined
    loginButton.setAttribute('data-bs-toggle', 'modal')
    loginButton.setAttribute('data-bs-target', '#myPopUp')
  }
}

function customLogout () {
  localStorage.removeItem('username')
  window.location.replace('/')
}

function checkLogin () {
  let exist = false

  const email = document.getElementById('myEmail').value
  const password = document.getElementById('myPassword').value

  $.ajax({
    url: './db/get',
    type: 'GET',
    timeout: 5000,
    success: function (users) {
      users.forEach((user) => {
        if (user.email == email && user.password == password) {
          localStorage.setItem('username', user.nome)
          window.location.replace('/' + user.ruolo)
          exist = true
        }
      })

      if (!exist) {
        document.getElementById('myAlert').style.display = 'block'
      }
    },
    error: function (xhr, status, error) {
    }
  })
}

function signUp () {
  let error = false

  const nomeUtente = document.getElementById('nomeUtente').value
  const cfUtente = document.getElementById('cfUtente').value
  const emailUtente = document.getElementById('emailUtente').value
  const passwordUtente = document.getElementById('passwordUtente').value
  const confermaPasswordUtente = document.getElementById('confermaPasswordUtente').value
  const ruoloUtente = document.getElementById('ruoloUtente').value

  console.log(cfUtente)
  console.log('length: ' + cfUtente.length)

  if (passwordUtente != confermaPasswordUtente) {
    document.getElementById('myPasswordAlert').style.display = 'block'
    error = true
  }

  if (cfUtente.length != 16) {
    document.getElementById('myCFAlert').style.display = 'block'
    error = true
  }

  if (!error) {
    const myUser = {
      nome: nomeUtente,
      email: emailUtente,
      password: passwordUtente,
      ruolo: ruoloUtente
    }

    $.ajax({
      url: './db/set',
      type: 'POST',
      data: JSON.stringify(myUser),
      contentType: 'application/json; charset=utf-8',
      timeout: 5000,
      success: function (users) {
        window.location.replace('/' + myUser.ruolo)
      },
      error: function (xhr, status, error) {
      }
    })
  }
}
