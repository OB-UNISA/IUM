let users = [{
  nome: "Antonio"
  email: "test@gmail.com",
  password: "myPassword",
  ruolo: "associazioneAnimalista"
},
{
  nome: "Oleg",
  email: "anotherTest@gmail.com",
  password: "yetAnotherPassword",
  ruolo: "dataScientist"
}]




function customOnload(){
  let username = localStorage.getItem("username")
  if(username){
    let loginButton = document.getElementById("loginButton")
    loginButton.innerHTML = username
    loginButton.onclick = undefined
    loginButton.setAttribute("data-bs-toggle", "modal")
     loginButton.setAttribute("data-bs-target", "#myPopUp")
  }
}

function customLogout(){
  localStorage.removeItem("username")
  window.location.replace('/')
}

function checkLogin(){
  
  const email = document.getElementById("myEmail").value
  const password = document.getElementById("myPassword").value

  users.forEach((user)=>{
    if(user.email==email && user.password==password){
      localStorage.setItem("username", user.nome)
      window.location.replace('/')
    }
  })

}
