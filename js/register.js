registerUser = document.getElementById('btnRegisterUser');

registerUser.addEventListener('click', function () {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordRepeat = document.getElementById('passwordRepeat').value;
    let result = validateForm(email, password, passwordRepeat);
    if (result === true) {
        saveUserToIndexedDB(email, password);

    }
});

/* REGISTER */
function validateForm(email, password, passwordRepeat) {
    // Email doğrulama
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return false;
    }

    // Şifre doğrulama
    if (password === "" || passwordRepeat === "") {
        alert("Das Passwortfeld darf nicht leer bleiben.");
        return false;
    }
    if (password !== passwordRepeat) {
        alert("Passwörter stimmen nicht überein.");
        return false;
    }
    if (password.length < 8) {
        alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
        return false;
    }
    // var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/;

    if (!passwordRegex.test(password)) {
        // alert("Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir.");
        alert("Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.");
        return false;
    }

    return true; // Tüm doğrulamalar geçildi, form gönderilebilir
}

// Function to save note to IndexedDB
function saveUserToIndexedDB(email, password) {
    var request = indexedDB.open('photoDB', 1);

    request.onerror = function (event) {
        console.log('Error opening IndexedDB:', event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        // // Notlar için bir nesne deposu (object store) oluştur
        // var objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        // Fotograflar için bir nesne deposu (object store) oluştur
        var objectStore = db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
        // Kulllanicilar için bir nesne deposu (object store) oluştur
        var objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      };
      

    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['users'], 'readwrite');
        var objectStore = transaction.objectStore('users');
        var addRequest = objectStore.add({ email: email, password: password });

        addRequest.onsuccess = function (event) {
            console.log('User saved to IndexedDB:', email);
            window.location.href = '/pages/foto.html';

        };

        transaction.onerror = function (event) {
            console.log('Failed to add note:', event.target.error);
        };
    };
    alert("Kunden wurde erfolgreich registiert");
}
