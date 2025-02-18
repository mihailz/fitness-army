// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyABcr2L8w1Q0ObevvmlO43hQD43LcZXoY0",
    authDomain: "fitness-army.firebaseapp.com",
    databaseURL: "https://fitness-army-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fitness-army",
    storageBucket: "fitness-army.appspot.com",
    messagingSenderId: "232059287122",
    appId: "1:232059287122:web:b4714c2ac949e82e73118b",
    measurementId: "G-0WSZXDX4GR",
  },
  applicationApi: "https://us-central1-fitness-army.cloudfunctions.net/app",
  bmiRapidApiKey: "7ab1706f35msh9acb516c756fdd5p1e8fcdjsn189bdfa4302d",
  bmiRapidApiHost: "mega-fitness-calculator1.p.rapidapi.com",
  bmiRapidApiDomain: "https://mega-fitness-calculator1.p.rapidapi.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
