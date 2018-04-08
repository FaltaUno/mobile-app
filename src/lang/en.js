import { Platform } from "react-native";

export default {
  app: {
    name: `Falta uno!`,
    slogan: `La app que no te deja tirado`,
    contactEmail: `falta.uno.2018@gmail.com`
  },
  action: {
    add: `Add`,
    delete: `Delete`,
    done: `Done`,
    edit: `Edit`,
    close: `Close`,
    cancel: `Cancel`
  },
  home: {
    title: `Home`,
    placeholder: `Write to filter...`,
    noPlayers: `There are no available players at this time`
  },
  login: {
    loginWithFacebook: `Login with Facebook`,
    logging: `Logging in...`,
    error: {
      auth: `An error ocurrend with the authorization..\nTry again later`,
      user_cancelled: `You cancelled the process.\nIn order to log in you need to authorize our app.`
    },
    success: `Process succeed!`
  },
  loading: `Loading...`,
  location: {
    service: {
      unkownError: `An error occurred.\n{{error}}`
    },
    error: {
      androidEmulator: `Oops, this will not work on Sketch in an Android emulator. Try it on your device!`,
      permissionDenied: `Permission to access location was denied`
    }
  },
  addMatch: {
    title: `New match`,
    nameLabel: `Match's title`,
    playersNeededLabel: `Players needed...`,
    playerNeededLabel: `Player needed...`,
    playersNeededPlaceholder: `Min: 1`,
    placeLabel: `Where?`,
    placePlaceholder: `Not defined`,
    addressLabel: `Address`,
    ...Platform.select({
      ios: {
        dateLabel: "When?"
      },
      android: {
        dateLabel: "Date",
        timeLabel: "Time"
      }
    }),
    notesLabel: `Notes`,
    noNameDefined: `You have to define the title for the match`,
    noLocationDefined: `You have to indicate where the match will be played`,
    noPlayersNeededDefined: `You have to input the players' quantity you need for your match`
  },
  matchSelector: {
    title: `Match selection`,
    label: `What match do you want to invite {{displayName}} to?`
  },
  myMatches: {
    title: `My matches`
  },
  myMatch: {
    loadingInvitesInfo: `Loading invites information`,
    noPlayersNeeded: `No players needed for this match`,
    approvedPlayersOutOfTotal: `{{approved}} approved players out of {{total}}`,
    noNotes: `No notes added`,
    invitesLabel: `Players`,
    inviteAction: `Invite`,
    shareButtonLabel: `Invite`,
    requestedInvitesLabel: `Pending for review`,
    noPendingInvites: `There are no invite requests for review`,
    approvedInvitesLabel: `Approved`,
    noApprovedInvites: `There are no approved players`,
    rejectedInvitesLabel: `Rejected`,
    noRejectedInvites: `There are no rejected players`
  },
  matches: {
    noAvailable: `You have no available matches`,
    addMatch: `Add match`,
    deleteMatch: `Delete`
  },
  nearMatches: {
    title:`Partidos cerca`
  },
  match: {
    inviteButtonText: `Invite players`,
    invitationTitle: `Invite players`,
    invitationDialogTitle: `Invite players`,
    invitationText: `Hi. I'm looking for players for my game to be played {{matchDateOn}}*{{matchDate}}* at *"{{matchPlace}}"*.\nFeel free to request an invite through the link below if you're interested\n`,
    on: `on`
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
    email: `Email`,
    memberSince: `Member since`,
    phoneNumberEmptyPlacholder: `Select country`,
    invalidPhoneNumber: `The phone number doesn't match with any valid format for your country`,
    welcomeTourLabel: `Initial configuration`
  },
  country: {
    placeholder: `Country`,
    list: {
      AR: `Argentina`,
      UY: `Uruguay`
    },
    phoneData: {
      AR: {
        code: `+54 9`,
        placeholder: `11 2345-6789`
      },
      UY: {
        code: `+598`,
        placeholder: "99 123 456"
      }
    }
  },
  invite: {
    title: `{{name}}'s invitation`,
    invitationTitle: `Invitation to...`,
    matchPlaceholder: `It'll be played at {{place}}`,
    invalidPhoneNumber: `This player didn't set up the phone. We can do nothing :(`,
    invalidPhoneNumberTitle: "Invalid phone number. ",
    invitationText: `Hi, {{playerName}}.\nI contact you through *{{appName}}*.\nI need one player for the match on *{{matchDate}} h* at *{{matchPlace}}*.\n{{matchLocationInfo}}\nIf you're interested, let me know please.`,
    invitationLocationText: `Just in case, I give you the place location url.\n{{locationUrl}}\n`,
    invitationFooter: `Message sent by *{{appName}}, _{{appSlogan}}_*\nRequest your test access at {{appContactEmail}}`
  },
  playerCard: {
    fromDistance: `At {{distance}} km away`
  },
  error: {
    urlNotSupported: `Can't handle url: {{url}}`
  },
  whatsapp: {
    buttonTitle: `Invite through WhatsApp`,
    urlNotSupported: `Can't handle url: {{url}}`,
    urlUnkownError: `An error occurred.\n{{err}}`
  },
  welcome: {
    hi: {
      headerTitle: "Before we start...",
      title: `Hi, {{displayName}}`,
      description: `Let's set up the app to get the most out of it`,
      buttonLabel: `Let's start`
    },
    phoneInput: {
      headerTitle: `Verification`,
      title: `Enter your phone...`,
      description: `Have your invitation code handy`,
      disclaimer: "",
      buttonLabel: `Enter invitation code`,
      descriptionFinal: `You will receive a SMS`,
      disclaimerFinal: `Your telephone company could charge your the common taxes for receiving this SMS`,
      buttonLabelFinal: `Receive verification code`,
      backText: 'Welcome'
    },
    phoneVerificationFinal: {
      headerTitle: `Confirmation`,
      title: `Check your phone`,
      description: `We have sent you the code at\n{{phone}}`,
      buttonLabel: `Enter your code`,
    },
    phoneVerification: {
      headerTitle: `Invitacion`,
      title: `Enter your invitation`,
      description: `Write down the code we gave you for the number {{phone}}`,
      buttonLabel: `Enter your code`,
      phoneNumberDisabled: `The phone number\n{{phone}}\nis not enabled for the closed beta.`,
      codeDoesNotMatch: `The given code is incorrect`,
      backText: `Phone input`
    },
    phoneConfirmation: {
      headerTitle: `Confirmed`,
      title: `Invitation confirmed`,
      description: `Your phone {{phone}} is between the enabled users for the closed beta`,
      buttonLabel: `Continue with the setup`,
      backText:`Check code`
    },
    locationPermission: {
      headerTitle: `Localization`,
      title: `Localization`,
      description: `We want to give you the best matches inside the app`,
      detail1: `For this reason, we will read your location everytime you open the app so we can offer you accurate data of near players for you to complete your games.`,
      detail2: `In a similar way, we will update your location on the background once a day for offering you to other users looking for players for their games.`,
      buttonLabel: `Enable localization`,
      permissionNotGranted: `ERROR.\nThe app requires the localization permissions in order to work.\nOtherwise, we cannot continue.`,
      goToSettingsButtonLabel: `Go to settings and enable localization`,
      permissionCheckButtonLabel: `Verify localization`,
      noLocationServicesEnabled: `No location services enabled. The app cannot continue.`,
      backText: `Code Confirmation`
    },
    configFinish: {
      headerTitle: `Ready`,
      title: `Ready!`,
      description: `You can now start looking for players for your games`,
      buttonLabel: `Start using the app!`,
      backText: `Geolocation`
    }
  }
};
