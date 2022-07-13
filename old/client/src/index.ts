
import Peer = require('simple-peer')

function codeGen(): string { 
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    var code = ''
    for(var i = 0; i < 4; i++){
        code += characters.charAt(Math.floor(Math.random()*characters.length))
    }
    return code
}

async function main() {

    //main menu document model
    var main_menu = document.getElementById("mainmenu")

    //guest link code entry modal
    var guest_link = document.getElementById("guestlink")
    var code_close = document.getElementById("code-close")
    var code_modal = document.getElementById("code-modal")

 
    guest_link.addEventListener("click", () => {
        code_modal.style.display = "block"
    })
    code_close.addEventListener("click", () => {
        code_modal.style.display = "none"
    })
    window.addEventListener("click", event => {
        if(event.target == code_modal){
            code_modal.style.display = "none"
        }
    })

    var code_form = document.forms["code-input"]

    code_form.onsubmit = async (e) => {
        console.log("submitted!")
        const codeFormData = new FormData(code_form)
        let code: string = codeFormData.get('code-input').toString()
        console.log("code entered:" + code)
        sessionStorage.setItem("connect code", code)
        window.location.assign("./html/2pgame.html")
        e.preventDefault();


    }

    

    //settings menu

    var settings_link = document.getElementById("settingslink")
    var settings_back = document.getElementById("settings-back")
    var settings = document.getElementById("settings")

    settings_link.addEventListener("click", () => {
        main_menu.style.display = "none"
        settings.style.display = "flex"
    })

    settings_back.addEventListener("click", () => {
        main_menu.style.display = "flex"
        settings.style.display = "none"
    })


    var arr_slider = document.getElementById("arr-input")
    var das_slider = document.getElementById("das-input")
    var sdt_slider = document.getElementById("sdf-input")
    var settings_form = document.forms["settings-input"]

    settings_form.onsubmit = async (e) => {
        e.preventDefault();

        console.log("settings set!")
        const settingFormData = new FormData(settings_form)
        let settingsValues = settingFormData.getAll("setting-input")
        console.log("numbe rof settings: "  + settingsValues)
        sessionStorage.setItem("arr", settingsValues[0].toString())
        sessionStorage.setItem("das", settingsValues[1].toString())
        sessionStorage.setItem("sdf", settingsValues[2].toString())
        main_menu.style.display = "flex"
        settings.style.display = "none"


    }
    
    var isHost: boolean
    var peer: Peer
    var code: string

    sessionStorage.setItem('role', 'null')

    const hostlink = document.getElementById('hostlink')
    const guestlink = document.getElementById('guestlink')

    hostlink.addEventListener("click", function(){
        isHost = true
        sessionStorage.setItem('role', 'host')

    })

    guestlink.addEventListener("click", function(){
        isHost = false
        sessionStorage.setItem('role', 'guest')


    })


}

main()