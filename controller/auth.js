/**
 * Created by paul on 21.01.16.
 */

const session = require('electron').session;


$(function() {
    localStorage.removeItem("name");
    loginForm();
});

function loginForm() {
    $('#loginForm').submit(function() {
        localStorage.setItem('name', $('input').val())
        window.location.href = '../html/login.html';
    });
}
