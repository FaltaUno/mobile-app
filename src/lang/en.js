export default {
  app: {
    name: `Falta uno!`,
    slogan: `La app que no te deja tirado`,
  },
  addMatch: {
    title: `New match`,
    nameLabel: `Match name`,
    placeLabel: `Where is the match?`,
    dateLabel: `When is the match?`
  },
  action: {
    add: `Add`,
    close: `Close`,
  },
  home: {
    title: `Home`,
    placeholder: `Write to filter...`,
    noPlayers: `There are no available players at this time`,
  },
  login: {
    loginWithFacebook: `Login with Facebook`,
    logging: `Logging in...`,
    error: {
      auth: `An error ocurrend with the authorization..\nTry again later`,
      user_cancelled: `You cancelled the process.\nIn order to log in you need to authorize our app.`,
    },
    success: `Process succeed!`,
  },
  loading: `Loading...`,
  location: {
    error: {
      androidEmulator: `Oops, this will not work on Sketch in an Android emulator. Try it on your device!`,
      permissionDenied: `Permission to access location was denied`
    }
  },
  matchSelector: {
    title: `Match selection`,
    label: `What match do you want to invite {{displayName}} to?`,
  },
  myMatches: {
    title: `My matches`,
  },
  matches:{
    noMatchesAvailable: `You have no available matches`,
    addMatch: `Add match`
  },
  myProfile: {
    title: `Profile`,
    available: `Show me available to play`,
    distance: `Until {{distance}} km. arround`,
    filterByDistance: `Filter matches by distance`,
    logout: `Log out`,
    logoutSuccess: `Logout successful`,
    myLocation: `My location`,
    phoneCountryLabel: `Country`,
    phoneNumber: `Phone number`,
    phoneNumberEmptyPlacholder: `Select country`,
    invalidPhoneNumber: `The phone number doesn't match with any valid format for your country`
  },
  country: {
    list: {
      AR: `Argentina`,
      UY: `Uruguay`,
    },
    phoneData: {
      AR: {
        code: `+54 9`,
        placeholder: `11 2345-6789`,
      },
      UY: {
        code: `+598`,
        placeholder: '99 123 456',
      },
    }
  },
  invite: {
    title: `{{name}}'s invitation`,
    invitationTitle: `Invitation to...`,
    matchPlaceholder: `It'll be played at {{place}}`,
    defaultText: "Hi. We need one player for our match. Wanna join in?",
    invalidPhoneNumber: `This player didn't set up the phone. We can do nothing :(`,
    invalidPhoneNumberTitle: "Invalid phone number. "
  },
  playerCard: {
    fromDistance: `At {{distance}} km away`
  },
  whatsapp: {
    buttonTitle: `Send a WhatsApp message`,
    urlNotSupported: `Can't handle url: {{url}}`,
    urlUnkownError: `An error occurred.\n{{err}}`,
  }
}
