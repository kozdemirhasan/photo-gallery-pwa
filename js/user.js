registerUser = document.getElementById('btnRegisterUser');
loginUser = document.getElementById('btnLogin');

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
        alert("Geçerli bir e-posta adresi giriniz.");
        return false;
    }

    // Şifre doğrulama
    if (password === "" || passwordRepeat === "") {
        alert("Şifre alanı boş bırakılamaz.");
        return false;
    }
    if (password !== passwordRepeat) {
        alert("Şifreler eşleşmiyor.");
        return false;
    }
    if (password.length < 8) {
        alert("Şifre en az 8 karakter olmalıdır.");
        return false;
    }
    // var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/;

    if (!passwordRegex.test(password)) {
        // alert("Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir.");
        alert("Şifre en az bir büyük harf, bir küçük harf ve bir sayı  içermelidir.");
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

    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['users'], 'readwrite');
        let objectStore = transaction.objectStore('users');
        var addRequest = objectStore.add({ email: email, password: password });

        addRequest.onsuccess = function (event) {
            console.log('User saved to IndexedDB:', email);
        };

        transaction.onerror = function (event) {
            console.log('Failed to add note:', event.target.error);
        };
    };
    alert("Kunden wurde erfolgreich registiert");
}






/* LOGIN */
loginUser.addEventListener('click', function () {
    console.log('chek user ...xx ');
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;

    let result = validateLogin(email, password);
    if (result === true) {
        checkUser(email, password);

    }
});

function checkUser(email, password) {
    console.log('chek user ...arguments');
    var request = indexedDB.open('photoDB', 1);

    request.onerror = function (event) {
        console.log('Error opening IndexedDB:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['users'], 'readonly');
        var objectStore = transaction.objectStore('users');

        objectStore.getAll().onsuccess = function (event) {
            var users = event.target.result;
            if (users.length > 0) {

                // Her fotoğraf için bir img etiketi oluştur ve boyutlandırma stilleri ekle
                users.forEach(function (user) {
                    if (user.email === email && user.password === password) {
                        console.log('Kullanici bulundu: ' + user.email + '\n');
                    }
                });

            } else {
                console.log('Kullanici kayitli degil');
            }
        };
    };
}

function validateLogin(email, password) {
    // Email doğrulama
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Geçerli bir e-posta adresi giriniz.");
        return false;
    }

    // Şifre doğrulama
    if (password === "" || passwordRepeat === "") {
        alert("Şifre alanı boş bırakılamaz.");
        return false;
    }

    if (password.length < 8) {
        alert("Şifre en az 8 karakter olmalıdır.");
        return false;
    }
    // var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/;

    if (!passwordRegex.test(password)) {
        // alert("Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir.");
        alert("Şifre en az bir büyük harf, bir küçük harf ve bir sayı  içermelidir.");
        return false;
    }

    return true; // Tüm doğrulamalar geçildi, form gönderilebilir
}