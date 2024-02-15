loginUser = document.getElementById('btnLogin');

/* LOGIN */
loginUser.addEventListener('click', function () {
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;

    let result = validateLogin(email, password);
    if (result === true) {
        checkUser(email, password);

    }
});

function checkUser(userEmail, userPassword) {
    var request = indexedDB.open('photoDB', 1);

    request.onerror = function (event) {
        console.log('sistemde kayitli kullanici yok.');
        console.log('Error opening IndexedDB:', event.target.errorCode);
    };

    // request.onupgradeneeded = function (event) {
    //     var db = event.target.result;
    //     // Fotograflar için bir nesne deposu (object store) oluştur
    //     // var objectStore = db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
    //     // Kulllanicilar için bir nesne deposu (object store) oluştur
    //     var objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    //   };  


    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['users'], 'readonly');
        var objectStore = transaction.objectStore('users');

        objectStore.getAll().onsuccess = function (event) {
            var users = event.target.result;
            if (users.length > 0) {

                // Her fotoğraf için bir img etiketi oluştur ve boyutlandırma stilleri ekle
                users.forEach(function (user) {
                    if (user.email === userEmail && user.password === userPassword) {
                        console.log('Kullanici bulundu: ' + user.email + '\n');
                        window.location.href = '/pages/foto.html';
                    }
                });

            } else {
                console.log('sistemde kayitli kullanici yok.');
            }
        };
    };
}

function validateLogin(userEmail, userPassword) {
    // Email doğrulama
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        alert("Geçerli bir e-posta adresi giriniz.");
        return false;
    }
   

    if (userPassword.length < 8) {
        alert("Şifre en az 8 karakter olmalıdır.");
        return false;
    }
    // var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/;

    if (!passwordRegex.test(userPassword)) {
        // alert("Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir.");
        alert("Şifre en az bir büyük harf, bir küçük harf ve bir sayı  içermelidir.");
        return false;
    }

    return true; // Tüm doğrulamalar geçildi, form gönderilebilir
}