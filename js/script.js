// Datos
const operators = [
  "suma",
  "resta",
  "producto",
  "division",
  "igual",
  "porcentaje",
];

const gameavatars = [
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
  "avatar6",
];

const foods = ["chicken", "burger", "hot-dog", "ice-cream", "pizza", "potatos"];

const flowers = ["daisy", "iris", "lavender", "rose", "sakura", "sunflower"];

const names = [
  "María",
  "Miguel",
  "Cristina",
  "Gloria",
  "Lucía",
  "Martina",
  "Sofía",
  "Paula",
  "Daniela",
  "Valeria",
  "Alba",
  "Julia",
  "Noa",
  "Hugo",
  "Daniel",
  "Martín",
  "Pablo",
  "Alejandro",
  "Lucas",
  "Álvaro",
  "Adrián",
  "Mateo",
  "David",
];

const configavatars = [
  "astronauta",
  "boy1",
  "boy2",
  "boy3",
  "boy4",
  "boy5",
  "farmer",
  "giraffe",
  "girl1",
  "girl3",
  "girl4",
  "girl5",
  "gril2",
  "happy1",
  "happy2",
  "officer",
  "pig",
  "vampire",
];
// -----------------------------------------------------------------------------------

// Nodos

// Header
const data = document.getElementById("data");
const data__name = document.getElementById("data__name");
const data__titlename = document.getElementById("data__titlename");
const data__img = document.getElementById("data__img");
// Config
const config = document.getElementById("config");

// Para los nombres
const configname = document.getElementById("configname");
const configname__input = document.getElementById("configname__input");
const configname__button = document.getElementById("configname__button");

// Para las imagenes
const configimage = document.getElementById("configimage");

// Para la configuración de las parejas
const configgames__couples = document.getElementById("configgames__foods");
const configgames__container = document.getElementById(
  "configgames__container"
);

// Juego
const game = document.getElementById("game");
const game__grid = document.getElementById("game__grid");
const finishgame = document.getElementById("finishgame");

// -----------------------------------------------------------------------------------
// Variables
let couplesImgsGame = [] //Aquí guardaré las rutas de las parejas del juego
//Variables para guardar el número de la posición que pulsa durante el juego
let pulsacion1
let pulsacion2
let countCouples = 0//Contador de aciertos que determina cuándo ha finalizado el juego
let turnoPulsaciones = true//True será la pulsación 1 y false la 2
let esperandoResultado = false//Variable para que no pueda pulsar otra img en el medio segundo de espera que se comprueba el resultado
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

const configgames__operations = document.getElementById("configgames__operations")
const configgames__foods = document.getElementById("configgames__foods")
//Paso el game__grid a un array para poder recorrerlo con funciones propias de un array y no solamente con for:
const game__gridArray = Array.from(game__grid.children)


//**FUNCIONES**
//*Función para cargar los elementos tras iniciar la página
const cargarElementos = () => {
  //Cargo los nombres:
  let fragmentNames = document.createDocumentFragment()
  names.map(name => {//Recorro el array de nombres para añadirlos al select
    fragmentNames.appendChild(generateOptionName(name))
  })
  configname.children[1].appendChild(fragmentNames)//Añado los nombres accediendo desde el padre
  //Cargo los avatares:
  let fragmentAvatars = document.createDocumentFragment()
  let imgAvatar = ""
  for (let i = 0; i < 8; i++) {//Cargo 8 avatares distintos borrando el que aparezca del array de avatares
    avatarPosition = randomPosition(configavatars)
    imgAvatar = configavatars[avatarPosition]
    fragmentAvatars.appendChild(generateAvatarImg("./assets/images/configavatars/", imgAvatar))//Añado el avatar al fragment
    configavatars.map(avatar => { avatar.remove })
    configavatars.splice(avatarPosition, 1)//Elimino el avatar que ha salido
  }
  configimage.children[1].appendChild(fragmentAvatars)//Añado los nombres accediendo desde el padre
  //Añado las imagenes de las parejas de juego
  let fragmentImgsGame = document.createDocumentFragment()
  //Uso la misma función para generar los arrays:
  generateImgsGame(operators, "./assets/images/operators/", "configgames__imgoperators", configgames__operations)
  generateImgsGame(foods, "./assets/images/foods/", "configgames__imgfoods", configgames__foods)
}

//*Función del controlador de clicks general de la configuración
const handleClickConfiguration = (ev) => {
  let button = ev.target
  if (button === configname__button && configname__input.value.trim() != "") {//Si pulsa en añadir nombre y el nombre tiene contenido
    //Añado el option desde el padre y usando la función par ello
    configname.children[1].prepend(generateOptionName(configname__input.value.trim()))
    configname.children[1].firstElementChild.setAttribute("selected", true)//Selecciono el último que he añadido, que será el primer hijo (no hace falta borrar los "selected" anteriores porque lo añado al principio y automáticamente selecciona el primer selected)
    //Añado el nombre al header
    removeDisplaynone([data, data__titlename])
    data__name.textContent = configname__input.value
    configname__input.value = ""//Reseteo el input del nombre
  } else if (button.classList.contains("configimage__img")) {//Si pulsa sobre un avatar
    //Añado el avatar al header
    removeDisplaynone([data, data__img])
    data__img.setAttribute("SRC", button.getAttribute("SRC"))
  } else if (button.parentElement === configgames__operations || button.parentElement === configgames__foods) {//Si pulsa en las imagenes del juego
    if (data__titlename.classList.contains("displaynone")) {//Si no ha seleccionado el nombre
      configname.classList.add("configerror")
    } else if (data__img.classList.contains("displaynone")) {//Si no ha seleccionado la imagen
      configimage.classList.add("configerror")
    } else {//Si sí que ha seleccionado tanto el nombre como el avatar
      config.classList.add("config__hide")
      game.classList.add("game__show")
      //Compruebo qué imagenes ha seleccionado para sacar el array de imagenes y la ruta necesaria para la función de genearar parejas
      if (button.parentElement === configgames__operations) {//Si ha seleccionado los operadores
        imgs = operators
        ruta = "./assets/images/operators/"
      } else {//Si ha seleccionado la comida 
        imgs = foods
        ruta = "./assets/images/foods/"
      }
      generateCouplesGame(imgs, ruta)//Genero las parejas según las imagenes que haya seleccionado el usuario
    }
  }
}

//*Función general del juego
const handleClickGame = (ev) => {
  img = ev.target

  if (img.classList.contains("game__img") && img.getAttribute("SRC") === "./assets/images/estrella.png" && !esperandoResultado) {//Si pulsa sobre una imagen del juego, todavía no ha acertado dicha imagen (no está descubierta) y no se está esperando que se resuelva si la pareja seleccionada es correcta
    if (turnoPulsaciones) {//Si es la primera que pulsa
      turnoPulsaciones = false
      pulsacion1 = game__gridArray.findIndex(children => children === img)//Guardo la posición que ha pulsado
      img.setAttribute("SRC", couplesImgsGame[pulsacion1])
    } else {//Si es la segunda
      turnoPulsaciones = true
      pulsacion2 = game__gridArray.findIndex(children => children === img)//Guardo la posición que ha pulsado
      img.setAttribute("SRC", couplesImgsGame[pulsacion2])
      checkCouple()//Compruebo la pareja en la segunda pulsación
    }
  }
}

//*Función para jugar otra vez
const gameAgain = (ev) => {
  button = ev.target
  if (button.getAttribute("ID") === "finishgame__button") {//Si pulsa sobre el botón de otra partida
    location.reload()
  }
}

//Función que retorna un <option> con el nombre para añadirlo al select de la configuración
const generateOptionName = (name) => {
  let optionName = document.createElement("OPTION")
  optionName.classList.add("configname__option")
  optionName.setAttribute("NAME", name)
  optionName.textContent = name
  return optionName
}

//Función que retorna un <img> con la imagen del avatar
const generateAvatarImg = (ruta, img) => {
  let imgAvatar = document.createElement("IMG")
  imgAvatar.classList.add("configimage__img")
  imgAvatar.setAttribute("SRC", ruta + img + ".png")
  return imgAvatar
}

//Función para crear las imagenes del juego: operadores y comida
const generateImgsGame = (imgs, ruta, estilos, padre) => {
  let fragment = document.createDocumentFragment()
  for (let i = 0; i < imgs.length; i++) {
    let imgGame = document.createElement("IMG")
    imgGame.setAttribute("SRC", ruta + imgs[i] + ".png")
    imgGame.classList.add(estilos)//*En caso de ser varios estilos podía haberlo recorrido si fueran un array, pero al ser solo uno lo añado directamente (también se pueden añadir varios en un mismo .add)
    fragment.appendChild(imgGame)//Lo voy añadiendo al fragment
  }
  padre.appendChild(fragment)//Añado el fragment al padre
}

//Función para generar una posición aletoria de un array dado
const randomPosition = (array) => {
  return Math.floor(Math.random() * array.length)
}

//Función para elminar la clase displaynone (hago esta función ya que es algo que hago más de una vez)
const removeDisplaynone = (arrayElementos) => {
  arrayElementos.map(elemento => elemento.classList.remove("displaynone"))
}

//Función cuando se produce un cambio en el select:
const printNameSelected = () => {
  removeDisplaynone([data, data__titlename])
  data__name.textContent = configname.children[1].value
}

//Función para generar un array con las parejas: cada img aparecerá dos veces en el array y su posición será aleatoria
generateCouplesGame = (arrayImgs, ruta) => {
  //Voy añadiendo al array de parejas una img al azar y cuando contenga dos veces dicha imagen elimino esa posición
  //El array de parejas será la ruta completa de cada imagen y el orden resultante será en el que aparezcan en el juego
  for (let i = 0; i < 12; i++) {
    let imgPosition = randomPosition(arrayImgs)
    let imgRuta = ruta + arrayImgs[imgPosition] + ".png"
    couplesImgsGame.push(imgRuta)
    //Filtro cuántas veces está la imgRuta y si aparece dos veces la elimino del array
    if (couplesImgsGame.filter(img => img === imgRuta).length === 2) {
      arrayImgs.splice(imgPosition, 1)//Elimino dicha posición
    }
  }
}


//Función para dar la vuelta a las imagenes incorrectas
const failCouple = () => {
  game__gridArray[pulsacion1].setAttribute("SRC", "./assets/images/estrella.png")
  game__gridArray[pulsacion2].setAttribute("SRC", "./assets/images/estrella.png")
  esperandoResultado = false//Después de la comprobación ya podrá pulsar otra
}
//Función para comprobar si ha pulsado correctamente las parejas
const checkCouple = () => {
  //Compruebo las img
  if (couplesImgsGame[pulsacion1] !== couplesImgsGame[pulsacion2]) {//Si son distintas doy la vuelta a las img de nuevo
    esperandoResultado = true
    //Tardo un segundo en dar la vuelta a las imgs si están mal
    setTimeout(failCouple, 500)
  } else {//Si acierta cuento el punto
    countCouples++
    if (countCouples === 6) {//Si ha acertado todas el juego termina
      finishgame.classList.add("finishgame__show")
    }
  }
}





//*LISTENERS
config.addEventListener("click", handleClickConfiguration)//Listener de la configuración
configname.children[1].addEventListener("change", printNameSelected)//Añado el evento sobre el select (para el select también podría haber guardado una variable seleccionandola por clase, pero como no tenía id, en vez de eso cada vez que me refiero a él accedo desde el padre)
game.addEventListener("click", handleClickGame)
finishgame.addEventListener("click", gameAgain)

//Elementos al cargar la página:
document.addEventListener("DOMContentLoaded", cargarElementos)

// Para resetear las animaciones
configname.addEventListener("animationend", () => {
  configname.classList.remove("configerror");
});
configimage.addEventListener("animationend", () => {
  configimage.classList.remove("configerror");
});


