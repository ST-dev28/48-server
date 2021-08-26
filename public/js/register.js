import { ajax } from "./ajax.js";

const formMessageDOM = document.querySelector('.form-messages');   // DOM => konkretus HTML failas(elementas)
const pFormMessageDOM = formMessageDOM.querySelector('.message');
const closeMessageDOM = formMessageDOM.querySelector('.close');
const formDOM = document.querySelector('.form');
const usernameDOM = document.getElementById('username');
const emailDOM = document.getElementById('email');
const passDOM = document.getElementById('pass');
const repassDOM = document.getElementById('repass');
const submitDOM = document.querySelector('button');

function showMessage(state, msg) {
    const allowedStates = ['info', 'success', 'error'];
    if (allowedStates.includes(state)) {
        formMessageDOM.classList.add('show');
        formMessageDOM.dataset.state = state;
        pFormMessageDOM.innerText = msg;
    }
}

function closeMessage() {
    formMessageDOM.classList.remove('show');
}

function submitFormInfo(e) {    //paspaudus mygtuka, forma viska is karto issiuncia i serveri
    e.preventDefault();

    const minimumPasswordLength = 8;

    const username = usernameDOM.value;
    const email = emailDOM.value;
    const pass = passDOM.value;
    const repass = repassDOM.value;

    if (username === '') {
        return showMessage('error', '"Username" negali buti tuscias');
    }
    if (email === '') {
        return showMessage('error', '"Email" negali buti tuscias');
    }
    if (pass.length < minimumPasswordLength) {
        return showMessage('error', `"Password" negali buti trumpesnis nei ${minimumPasswordLength} simboliai`);
    }
    if (repass.length < minimumPasswordLength) {
        return showMessage('error', `"Repeat password" negali buti trumpesnis nei ${minimumPasswordLength} simboliai`);
    }
    if (pass !== repass) {
        return showMessage('error', 'Nesutampa "Password" ir "Repeat password"');
    }

    closeMessage();
    ajax({              // informacija perduodama is narsykles i serveri
        method: 'POST', // POST - issiusti kazka naujo => naujas irasas. Dar yra: GET, PUT, DELETE
        header: {},
        endpoint: 'api/users',   // nuoroda, kur issiusti informacija
        data: { username, email, password: pass }
    }, responseAction);
}

function responseAction(response) {
    try {
        const responseObject = JSON.parse(response);
        // {error: "Message"}
        // {success: "Message"}
        const keys = Object.keys(responseObject);
        // ['error']
        // ['success']
        const key = keys[0];
        showMessage(key, responseObject[key]);
    } catch (error) {
        showMessage('error', 'Serverio klaida!');
    }
}

closeMessageDOM.addEventListener('click', closeMessage);

submitDOM.addEventListener('click', submitFormInfo);

// showMessage('info', 'Labas');
// showMessage('success', 'Tau pavyko!');
// showMessage('error', 'Kazkur yra klaida!');