const btnAdd = document.getElementById('btnAdd');
const btnCapture = document.getElementById('btnCapture');
const btnEsc = document.getElementById('btnEsc');
const video = document.getElementById('video');
var note = document.getElementById('noteInput');



//check if the sw is supported
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}


//kayitli fotograflarin hepsini göster
displayPhotoFromIndexedDB();



const constraints = {
  // audio: true, // Mikrofona erişim sağlamak için
  video: {
    facingMode: 'environment' // Arka kameraya erişim sağlamak için (mobil cihazlar için)
  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    // Başarılı şekilde mikrofon ve kameraya erişildiğinde yapılacak işlemler
    console.log("Zugriff auf Mikrofon und Kamera erlaubt");
    video.srcObject = stream; // Videoyu görüntüleme veya işleme
  })
  .catch((error) => {
    // Kullanıcı erişim iznini reddetti veya bir hata oluştuğunda yapılacak işlemler
    console.error('Error accessing camera and/or microphone:', error);
  });



// Sayfa yüklendiğinde ve boyut değişikliklerinde video ve textarea boyutlarını ayarla
window.onload = resizeVideo;
window.onresize = resizeVideo;

function resizeVideo() {
  // Textarea genişliğini al
  var textareaWidth = note.offsetWidth;
  // Video genişliğini textarea genişliği olarak ayarla
  video.style.width = textareaWidth + 'px';
  // Video yüksekliğini oranlı olarak ayarla
  video.style.height = (video.videoHeight / video.videoWidth) * textareaWidth + 'px';
}


btnAdd.disabled = true;
btnCapture.disabled = false;
btnEsc.disabled = true;




// Function to save note to IndexedDB
// function saveNoteToIndexedDB(note) {
//   var request = indexedDB.open('photoDB', 1);

//   request.onerror = function (event) {
//     console.log('Error opening IndexedDB:', event.target.errorCode);
//   };

//   request.onsuccess = function (event) {
//     var db = event.target.result;
//     var transaction = db.transaction(['notes'], 'readwrite');
//     var objectStore = transaction.objectStore('notes');
//     var addRequest = objectStore.add({ note: note });

//     addRequest.onsuccess = function (event) {
//       console.log('Note saved to IndexedDB:', note);
//     };

//     transaction.onerror = function (event) {
//       console.log('Failed to add note:', event.target.error);
//     };
//   };
// }

// Function to save photo to IndexedDB
function savePhotoToIndexedDB(photoDataUrl) {
  var note = document.getElementById('noteInput').value;

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
      // var objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    };    

  request.onsuccess = function (event) {
    var db = event.target.result;
    var transaction = db.transaction(['photos'], 'readwrite');
    var objectStore = transaction.objectStore('photos');
    var addRequest = objectStore.add({ photoUrl: photoDataUrl, note: note });

    addRequest.onsuccess = function (event) {
      console.log('Photo saved to IndexedDB.');
    };

    transaction.onerror = function (event) {
      console.log('Failed to save photo:', event.target.error);
    };
  };

}



// IndexedDB veritabanına butona tiklandiginda not ve fotograf ekleme fonksiyonu
btnAdd.addEventListener('click', function () {
  let noteInput = document.getElementById('noteInput');
  let note = noteInput.value;
  // saveNoteToIndexedDB(note);
  downloadPhoto();
  displayPhotoFromIndexedDB();

  noteInput.value = ''; // noteInput içeriğini boş bir string yapma

});


//fotograf isimlendirmede kullanilacah zaman bildirimini alma
function getTime() {
  let time = new Date();
  return time.getFullYear() +
    ((time.getMonth() + 1) < 10 ? '0' : '') + (time.getMonth() + 1) +
    (time.getDate() < 10 ? '0' : '') + time.getDate() +
    (time.getHours() < 10 ? '0' : '') + time.getHours() +
    (time.getMinutes() < 10 ? '0' : '') + time.getMinutes() +
    (time.getSeconds() < 10 ? '0' : '') + time.getSeconds() +
    (time.getMilliseconds() < 10 ? '00' : (time.getMilliseconds() < 100 ? '0' : '')) + time.getMilliseconds();

}

// Function to capture a photo from the video stream
function capturePhoto() {
  console.log('Photo captured...');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.style.display = 'block';
  canvas.style.border = '3px solid red'; // 2 piksel kalınlığında kırmızı bir sınır çiz
  video.style.display = 'none';

  btnAdd.disabled = false;
  btnCapture.disabled = true;
  btnEsc.disabled = false;
}

//esc butonuna tiklandiginda cekilen fotografi canvasdan kaldir
function escPhoto() {
  // Display the captured photo
  canvas.style.display = 'none';
  video.style.display = 'block';

  btnAdd.disabled = true;
  btnCapture.disabled = false;
  btnEsc.disabled = true;

}

// Function to download the captured photo
function downloadPhoto() {

  const photoDataUrl = canvas.toDataURL('image/png');

  // const a = document.createElement('a');
  // a.href = photoDataUrl;
  // a.download = 'captured_photo_' + getTime() + '.png';
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);

  // console.log("fotograf indirildi...");

  // Save photo to IndexedDB
  savePhotoToIndexedDB(photoDataUrl);

  // Reset for the next capture
  canvas.style.display = 'none';
  video.style.display = 'block';

  btnAdd.disabled = true;
  btnCapture.disabled = false;
  btnEsc.disabled = true;
}





// Function to retrieve photo from IndexedDB and display it in the browser         
function displayPhotoFromIndexedDB() {

  var request = indexedDB.open('photoDB', 1);
  var db ;

  request.onerror = function (event) {
    console.log('Error opening IndexedDB:', event.target.errorCode);
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    // Fotograflar için bir nesne deposu (object store) oluştur
    var objectStore = db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
    // Kulllanicilar için bir nesne deposu (object store) oluştur
    // var objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
  };

  request.onsuccess = function (event) {
    var db = event.target.result;
    var transaction = db.transaction(['photos'], 'readwrite');
    var objectStore = transaction.objectStore('photos');

    objectStore.getAll().onsuccess = function (event) {
      var photos = event.target.result;
      if (photos.length > 0) {
        // Fotoğrafları göstermek için bir container oluştur
        var photoContainer = document.querySelector('#photo-container');
        if (!photoContainer) {
          photoContainer = document.createElement('div');
          photoContainer.className = 'photo-container';
          document.body.appendChild(photoContainer);
        } else {
          // Eğer photoContainer varsa, içeriğini temizle
          photoContainer.innerHTML = '';
        }

        // Her fotoğraf için bir img etiketi oluştur ve boyutlandırma stilleri ekle
        photos.forEach(function (photo) {
          var img = document.createElement('img');
          img.src = photo.photoUrl;
          img.className = 'photo';
          img.style.maxWidth = '200px';
          img.style.maxHeight = '200px';
          img.style.width = 'auto';
          img.style.height = 'auto';
          img.style.objectFit = 'cover'; // Görüntüyü tamamen dolduracak şekilde ölçekle
          img.style.marginLeft = '10px';
          img.style.marginTop = '10px';
          img.alt = photo.note;
          img.onclick = function () {
            showMessage(photo.note);
          };

          photoContainer.appendChild(img);


        });

        // Container'ı sayfaya ekle
        document.body.appendChild(photoContainer);
      } else {
        console.log('No recorded photos found in IndexedDB.');
      }
    };
  };
}



function showMessage(message) {
  // var messageDiv = document.getElementById("messageDiv");
  // messageDiv.innerText = message;
  alert(message);
}


//NOTIFICATION
function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        // İzin verildiğinde bildirim gönderme işlemini gerçekleştir
        sendNotification();
        // sendNotificationWithDelay();
      }      
    });
  } else {
    // Zaten izin verildiğinde direkt bildirim gönderme işlemini gerçekleştir
    sendNotification();
    // sendNotificationWithDelay();
  }
}

function sendNotification() {
  console.log('Notification sent');
  var notification = new Notification('Titel', {
    body: 'Inhalt',
    icon: 'img/favicon.png'
  });


  // notification.onclick = function () {
  //   // Bildirime tıklandığında alert ile bilgi ver
  //   alert('Notification\nTitle: ' + this.title + '\nBody: ' + this.body);
  // };


}



// function sendNotificationWithDelay() {
//   setTimeout(function() {
//     var notification = new Notification('Titel', {
//       body: 'Inhalt',
//       icon: 'img/favicon.png'
//     });
//   }, 3000); // 3 saniye (3000 milisaniye) beklet
// }

function showNotification() {
  let notificationOptions = {
    body: 'Some Notification information',
    icon: '<>'
  }
  let notif = new Notification('My New Notification', notificationOptions);

  notif.onclick = () => {
    console.log('Notification clicked');
  }
}









/*

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuViKspJVFBOy1rGnd8bLoDq22Igc9Edg",
  authDomain: "pwa-photo-gallery-c06ba.firebaseapp.com",
  projectId: "pwa-photo-gallery-c06ba",
  storageBucket: "pwa-photo-gallery-c06ba.appspot.com",
  messagingSenderId: "351307904337",
  appId: "1:351307904337:web:accc87f6907fcda1c3cf70",
  measurementId: "G-F9KS9TVT2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// FIREBASE
const db = firebase.firestore();

// Not eklemek için bir koleksiyon referansı al
const notesCollection = db.collection('notes');

// Yeni bir not eklemek için
function addNoteToFirebase(note) {
  notesCollection.add({
    note: note,
    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Sunucu zamanıyla notun eklendiği zamanı kaydet
  })
    .then(docRef => {
      console.log('Note successfully added:', docRef.id);
    })
    .catch(error => {
      console.error('Error adding note:', error);
    });
}


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotificationOnNoteAdded = functions.firestore
  .document('notes/{noteId}')
  .onCreate((snapshot, context) => {
    // Yeni notun verisini al
    const noteData = snapshot.data();

    // Bildirim gönderme işlemleri
    // Örneğin: Push bildirimi gönderme veya e-posta gönderme
  });


*/






/*
 
//// 1 saniye titreşim, 1 saniye bekleme, ardından 2 saniye titreşim
//const vibrationPattern = [1000, 1000, 2000];
//
//// Titreşimi başlat
//navigator.vibrate(vibrationPattern);
//
//// Belirli bir süre sonra titreşimi durdurmak için
//setTimeout(() => {
//  navigator.vibrate(0); // 0 parametresiyle titreşimi durdur
//}, 5000); // Örneğin, 5 saniye sonra titreşimi durdur
 
 
 
 
 
//// Bluetooth API'larına erişim izni iste
//navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
//  .then(device => {
//    // Cihazı bulduktan sonra işlemleri yap
//    console.log('Bulunan cihaz:', device.name);
//  })
//  .catch(error => {
//    console.error('Bluetooth cihazı bulma hatası:', error);
//  });
 
 
 
//PUSH NOTIFICATION
// Bu kod, push bildirimine izin verildiğinde bildirim gösterir
function askPermission() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      //  showNotification();
      //  console.log('man kann hier push notification schreiben...  ')
    } else {
      console.error("Push notification permission denied");
    }
  });
}
 
// Bu kod, sayfa yüklendiğinde push izni kontrol eder ve gerekirse izin ister
window.addEventListener("load", function () {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    // Service Worker destekliyorsa ve PushManager kullanılabiliyorsa
    navigator.serviceWorker.ready
      .then(function (registration) {
        return registration.pushManager.getSubscription();
      })
      .then(function (subscription) {
        if (!subscription) {
          askPermission();
        }
      })
      .catch(function (error) {
        console.error("Error checking push subscription:", error);
      });
  } else {
    console.log("Push notifications are not supported in this browser.");
  }
});
 
// Bu fonksiyon, push bildirimi göstermek için kullanılır
function showNotification() {
  // Notification API'sini kullanarak bildirim oluştur
  self.registration.showNotification("Baslik", {
    body: "Bildirim icerigi"
    //icon: "path/to/icon.png", // Bildirim ikonu (isteğe bağlı)
  });
}
 
 
 
 
//indexedDB
 
// IndexedDB'nin adı
const dbName = "myDatabase";
const storeName = "myStore";
 
// Veritabanı oluşturma veya var olanı açma
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
 
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: "id" });
        };
 
        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
 
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};
 
// Veriyi IndexedDB'ye ekleme
const addToDB = (data) => {
    openDB().then((db) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
 
        store.add(data);
    });
};
 
 
 
// Veritabanından veri çekme
const getFromDB = () => {
    return new Promise((resolve, reject) => {
        openDB().then((db) => {
            const transaction = db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
 
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
 
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
};
 
// Çevrimdışı durumda veriyi kullanma
function useOfflineData() {
    getFromDB().then((data) => {
        // Verileri kullanma
        console.log("Çevrimdışı Veriler:", data);
    });
}
 
// Çevrimdışı durumu kontrol etme
function checkOfflineStatus() {
    if (!navigator.onLine) {
        useOfflineData();
    }
}
 
*/
