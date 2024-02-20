const btnAdd = document.getElementById('btnAdd');
const btnCapture = document.getElementById('btnCapture');
const btnEsc = document.getElementById('btnEsc');
const video = document.getElementById('video');
var note = document.getElementById('noteInput');
const toggleCameraButton = document.getElementById('toggleCameraButton');
let currentFacingMode = 'environment'; // Varsayılan olarak arka kamera
const photoGallery = document.getElementById('photoGallery');


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


// const constraints = {
//   // audio: true, // Mikrofona erişim sağlamak için
//   video: {
//     facingMode: 'environment' // Arka kameraya erişim sağlamak için (mobil cihazlar için)
//   }
// };

// Sayfa yüklendiğinde kamerayı başlat
// updateCamera();
// Kamera ayarlarını güncelleme fonksiyonu


  navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode } })
    .then((stream) => {
      // Başarılı şekilde mikrofon ve kameraya erişildiğinde yapılacak işlemler
      // console.log("Zugriff auf Mikrofon und Kamera erlaubt");
      console.log('Camera default mode: ' + currentFacingMode);
      video.srcObject = stream; // Videoyu görüntüleme veya işleme
    })
    .catch((error) => {
      // Kullanıcı erişim iznini reddetti veya bir hata oluştuğunda yapılacak işlemler
      console.error('Error accessing camera and/or microphone:', error);
    });
// }





// Kamera geçiş butonuna tıklandığında
toggleCameraButton.addEventListener('click', () => {
  // Mevcut kamera modunu değiştir
  if (currentFacingMode === 'environment') {
    currentFacingMode = 'user'; // Ön kamera
    // console.log('Frontkamera ausgewählt');
  } else {
    currentFacingMode = 'environment'; // Arka kamera
    // console.log('Rückfahrkamera ausgewählt');
  }

  // getUserMedia çağrısını güncelleme
  navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode } })
    .then(stream => {
      // Kamera erişimi başarılı, akışı görüntüle
      console.log('Camera mode: ' + currentFacingMode);
      video.srcObject = stream;
    })
    .catch(error => {
      // Hata durumunda
      console.error('Error accessing camera:', error);
    });

  // Kamera ayarlarını güncelle
  // updateCamera();
  // resizeVideo();
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
  var db;

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
          photoGallery.style.display = 'block';
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
        photoGallery.style.display = 'none';
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
    icon: '/img/favicon.png'
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


// LOCATION 
var btnLocation = document.getElementById("btnLocation");

// Button'a tıklandığında belirli bir sayfaya yönlendir
btnLocation.addEventListener("click", function () {
  window.location.href = "/pages/location.html";
});


