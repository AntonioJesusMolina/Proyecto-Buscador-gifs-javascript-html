let lista = [];

/*Creo la función buscar que recibirá el texto del input del html */
function buscar() {
  let txt = document.getElementById("in").value;
  document.getElementById("divp").style.visibility = "hidden";
  //console.log(txt);
  //Compruebo mediante un match que si los valores introducidos no es texto, que lance un alert.
  if (!txt.match(/^[A-Za-z ]+$/)) {
    alert("Inserte un dato NO numerico");
  } else {
    guardarHistorial(txt);
    promesa(txt);
  }
  //Limpio la caja del input llamando al metoido
  limpiarInput();
}
//Metodo que limpia la caja del input, sustituyendo el contenido por una cadena vacia
function limpiarInput() {
  document.getElementById("in").value = ""; // Limpia el campo previamente seleccionado.
}
//Método para guardar el historial, le pasamos el texto utilizado en el input para buscar
//y lo va añadiendo a una lista.
function guardarHistorial(txt) {
  //agrego al localstorage el texto incluido y lo parseo a JSON
  lista.push(txt);
  localStorage.setItem("historial", JSON.stringify(lista));
}
//Función para mostrar el historial del locastorage
function mostrarHistorial() {
  document.getElementById("divp").style.visibility = "visible";
  document.getElementById("p1").innerHTML = `<p>Se ha buscado ${JSON.parse(
    localStorage.getItem("historial")
  )}</p>`;
}
//Función que borra el hsitorial
function borrarHistorial() {
  //localStorage.clear();
  localStorage.removeItem("historial");
  //Escondemos el div
  document.getElementById("divp").style.visibility = "hidden";
}

//Función que realiza una promesa a la apì, regresa la bsuqueda, la pasamos a formato JSON,
//llamamos al metodo que crea las tablas y le pasamos la variable con el JSON
async function promesa(txt) {
  let url = "https://api.giphy.com/v1/gifs/search?api_key=";
  let apiKey = "Z4PAQTsExKW2vumTYlaLJ3pKdZ2Ksffw"; //api_key=Z4PAQTsExKW2vumTYlaLJ3pKdZ2Ksffw&q=dog&limit=25&offset=0&rating=g&lang=en
  let sentencia = `${url}${apiKey}&q=${txt}&limit=12&offset=0&rating=g&lang=en`; //con limit=12 limitamos que solo nos mande 12 elementos
  const resp = await fetch(sentencia);
  const gifs = await resp.json();
  const elementos = gifs.data;
  console.log(elementos);
  //Si el array elementos está vacio, haremos que se muestre en p1 un aviso
  if (elementos.length == 0) {
    //hago el div para imprimir que no hay resukltado visible
    document.getElementById("divp").style.visibility = "visible";
    //hago invisible la tabla
    document.getElementById("div2").style.visibility = "hidden";
    let p = document.getElementById("p1");
    p.innerHTML = `<p>No hay contenido  relativo a esa palabra
    </p>`;
    document.getElementById("divp").appendChild(p);
  } else {
    //Si no, que nos cree la tabla con el contenido
    crearTabla(elementos);
  }
}
//Función para crear las tablas.
function crearTabla(elementos) {
  let table = document.getElementById("tabla");
  //Establezco que la tabla sea visible
  document.getElementById("div2").style.visibility = "visible";
  document.getElementById("div2").appendChild(table);
  //Creo un contador para ir contando los elementos del array,
  //y para añadir a las celdas la url y el titulo de cada elemento
  let cont = 0;
  for (let i = 0; i < 4; i++) {
    let fila = document.getElementById("tr" + i);
    document.getElementById("tabla").appendChild(fila);
    for (let j = 0; j < 3; j++) {
      let td = document.getElementById("td" + cont);
      td.style.textAlign = "center";
      td.innerHTML = `<img src="${elementos[cont].images.original.url}" width= "300px" height="300px"><br><h6 id="h6">${elementos[cont].title}</h6>`;
      cont++;
      fila.appendChild(td);
    }
  }
}
//Función para guardar los datos de la busquedad en un txt en formato json
function guardarDatos() {
  //nombro el archivo
  const filename = "resultados.txt";
  //crean una etiqueta a transitoria para realizar la descarga
  let element = document.createElement("a");
  //le paso a element mediante el setatribute la lsita con las palabras clave, buscadas.
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(lista)
  );
  //le establecemos los atributos de descarga y la variable del nombre del archivo
  element.setAttribute("download", filename);
  //Oculto el elemento con display none
  element.style.display = "none";
  document.body.appendChild(element);
  //Con click lannzamos el elemento
  element.click();
  //Eliminamos el elemento una vez guardados los datos.
  document.body.removeChild(element);
}
