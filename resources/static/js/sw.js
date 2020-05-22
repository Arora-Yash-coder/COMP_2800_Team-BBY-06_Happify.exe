//THIS IS THE SERVICE WORKER THAT WILL BE REGISTERED TO THE BROWSER WHEN
//THE USER HAS VISITED THE PAGE.
//CODE SIMILAR TO MINE CAN BE FOUND HERE:
//https://developers.google.com/web/fundamentals/push-notifications/handling-messages
/*content:
  self.addEventListener('push', function(e) {
  //These are the options for showing up the notification
  var options = {
    body: "It's a good habbit to go to bed early!",
    icon: 'img/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
     
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: "It's bed time ", title: "please Take a rest now",
        icon: 'img/favicon-32x32.png'},
      {action: 'close', title: 'Close',
        icon: 'img/favicon-32x32.png'},
    ]
  };
    self.skipWaiting();
    self.registration.showNotification('Go To Bed Early!', options)
    
});
*/
self.addEventListener('push', function(e) {
  //These are the options for showing up the notification
  var options = {
    body: "It's a good habbit to go to bed early!",
    icon: 'img/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
     
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: "It's bed time ", title: "please Take a rest now",
        icon: 'img/favicon-32x32.png'},
      {action: 'close', title: 'Close',
        icon: 'img/favicon-32x32.png'},
    ]
  };
    self.skipWaiting();
    self.registration.showNotification('Go To Bed Early!', options)
    
});