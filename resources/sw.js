
//THIS FILE HAS TO BE PUT HERE TO TAKE EFFECT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//THIS FILE HAS TO BE PUT HERE TO TAKE EFFECT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//THIS FILE HAS TO BE PUT HERE TO TAKE EFFECT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//SW START
//SOURCE:https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications?hl=fr
//HELPED BY SOURCE

//THIS IS THE SERVICE WORKER FILE TO BE LOADED TO THE BROWSER
//WHEN THE USER GOES INTO THE REMINDER FUNCTION.
//IT WILL BE REGISTERED ONCE THE USER 
//HAS HIT THE START REMINDER BUTTON
self.addEventListener('push', function(e) {
  var timestamp = Date.now();
  var options = {
    // we cannot use the next line of code, the browser is not yet supporting this
    // showTrigger: new TimestampTrigger(timestamp + 10000),
    body: "It's a good habbit to go to bed early!",
    icon: 'img/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: "It's bed time ", title: "please Take a rest now",
        icon: '/static/img/favicon-32x32.png'},
      {action: 'close', title: 'Close',
        icon: '/static/img/favicon-32x32.png'},
    ]
  };
    self.skipWaiting();
    self.registration.showNotification('Go To Bed Early!', options)
    
});


//SW END
//SOURCE:https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications?hl=fr
//HELPED BY SOURCE