self.addEventListener('push', function(e) {
  var options = {
    body: 'This notification was generated from a push!',
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'Sleep', title: 'Time for bed now',
        icon: './../resources/static/img/shit-icon-smiling-face-symbol-260nw-404844514.webp'},
      {action: 'bedtime', title: 'OK',
        icon: 'images/xmark.png'},
    ]
  };
    self.skipWaiting();
    self.registration.showNotification('sleep', options)
    
});