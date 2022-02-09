
import { hostname } from 'os'
import Peer = require('simple-peer')
import wrtc = require('wrtc')




/*
functionality to create lobby with unique code
where is serverlist?

*/

async function getLobbyList(): Promise<any>{

    const response = await fetch("http://localhost:3000/api/lobbies")
    const lobby_list = await response.json()

    return lobby_list
    

}

async function populateHub(lobby_list){

    // MAKE AN XMLHTTPREQUEST TO SERVER FOR LOBBY LIST


    let lobby_table = document.getElementById("lobby table")
    // lobby_code_el.innerHTML = message.code
    lobby_list.forEach(lob => {
        let lobby_row =  document.createElement("tr")
        let lobby_code_cell = document.createElement("th")
        let lobby_owner = document.createElement("th")

        //create lobby code element, which is a link to that lobby
        let lobby_code_el = document.createElement("a")
        lobby_code_el.setAttribute("href", "./2pgame.html")
        lobby_code_el.innerHTML = lob.code
        lobby_code_el.onclick = function(){
            sessionStorage.setItem("connect code", lob.code)
        }


        lobby_code_cell.appendChild(lobby_code_el)

        lobby_row.appendChild(lobby_code_cell)
        lobby_table.appendChild(lobby_row) 
    });

}


if(sessionStorage.getItem("role") === "guest"){
    getLobbyList().then(lobby_list => {
        console.log(lobby_list)
        populateHub(lobby_list)
    })
}
