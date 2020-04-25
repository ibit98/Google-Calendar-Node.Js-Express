var googleUser = {};

var startApp = function() {
  gapi.load('auth2', function() {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '547564227179-lfn9phhqrrgav2fj5812s1hfs51f55k7.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      scope: "https://www.googleapis.com/auth/calendar"
    });
    attachSignin(document.getElementById('customBtn'));
  });
};

function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(element, {},
    function(googleUser) {
      document.getElementById('change').innerText = googleUser.getBasicProfile().getName();
      document.getElementById('name').innerText = "Signed in: " +
        googleUser.getBasicProfile().getName();
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      console.log(googleUser.calendarList.get())
      // var id_token = googleUser.getAuthResponse().id_token;
      // var xhttp = new XMLHttpRequest();
      // xhttp.open('POST', 'http://localhost:3000/add');
      // xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // xhttp.onreadystatechange = function() {
      //   if (this.readyState == 4 && this.status == 200) {
      //     console.log(this.responseText);
      //   }
      // };
      // xhttp.send(profile);
    //   function listEvents(auth) {
    //     const calendar = google.calendar({
    //       version: 'v3',
    //       auth
    //     });
    //     calendar.events.list({
    //       calendarId: 'primary',
    //       timeMin: (new Date()).toISOString(),
    //       maxResults: 10,
    //       singleEvents: true,
    //       orderBy: 'startTime',
    //     }, (err, res) => {
    //       if (err) return console.log('The API returned an error: ' + err);
    //       const events = res.data.items;
    //       if (events.length) {
    //         console.log('Upcoming 10 events:');
    //         events.map((event, i) => {
    //           const start = event.start.dateTime || event.start.date;
    //           console.log(`${start} - ${event.summary}`);
    //         });
    //       } else {
    //         console.log('No upcoming events found.');
    //       }
    //     });
    //   }
    // },

    function(error) {
      alert(JSON.stringify(error, undefined, 2));
    });
}
