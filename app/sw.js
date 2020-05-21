//THIS IS THE SERVICE WORKER FILE TO BE LOADED TO THE BROWSER
//WHEN THE USER GOES INTO THE REMINDER FUNCTION.
//IT WILL BE REGISTERED ONCE THE USER 
//HAS HIT THE START REMINDER BUTTON
self.addEventListener('push', function(e) {
  var options = {
    body: 'Go to bed lah!',
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'Sleep', title: 'Time for bed now',
       },
      {action: 'bedtime', title: 'OK',
        },
    ]
  };
    self.skipWaiting();
    self.registration.showNotification('sleep', options)
    
});