export default {
  app: {
    name: `Falta uno!`,
    slogan: `La app que no te deja tirado`,
    contactEmail: `falta.uno.2018@gmail.com`
  },
  addMatch: {
    title: `Nuevo partido`,
    nameLabel: `Nombre del partido`,
    placeLabel: `¿Dónde se juega?`,
    dateLabel: `¿Cuándo?`
  },
  action: {
    add: `Agregar`,
    edit: `Editar`,
    close: `Cerrar`,
  },
  home: {
    title: `Cerca tuyo`,
    placeholder: `Escribe para filtrar`,
    noPlayers: `No hay jugadores disponibles por ahora`,
  },
  login: {
    loginWithFacebook: `Ingresar con Facebook`,
    logging: `Ingresando...`,
    error: {
      auth: `Ocurrió un error al guardar la autorización.\nIntentá nuevamente más tarde`,
      user_cancelled: `Cancelaste el proceso.\nPara ingresar tenés que autorizar la aplicación.`,
    },
    success: `¡Proceso completado con éxito!`,
  },
  loading: `Cargando...`,
  location: {
    error: {
      androidEmulator: `Ups, esto no va a funcionar en Sketch en el emulador de Android. ¡Prueba en tu dispositivo!`,
      permissionDenied: `Permisos denegados`
    }
  },
  matchSelector: {
    title: `Selección de partido`,
    label: `¿A qué partido querés invitar a {{displayName}}?`,
  },  
  myMatches: {
    title: `Mis partidos`,
  },
  matches:{
    noAvailable: `No tenés ningún partido`,
    addMatch: `Agregar partido`,
  },
  matchList: {
    title: `Mis partidos`,
    noMatchesAvailable: `No tenés ningún partido`,
    addMatch: `Agregar partido`
  },
  myProfile: {
    title: `Perfil`,
    available: `Estoy disponible para jugar`,
    distance: `Hasta {{distance}} km. a la redonda`,
    filterByDistance: `Filtrar partidos por distancia`,
    logout: `Cerrar sesión`,
    logoutSuccess: `Tu sesión se ha cerrado con éxito`,
    myLocation: `Mi ubicación`,
    phoneCountryLabel: `País`,
    phoneNumber: `Teléfono`,
    email: `Correo`,
    memberSince: `Miembro desde`,
    phoneNumberEmptyPlacholder: `Seleccione país`,
    invalidPhoneNumber: `El número telefónico ingresado no coincide con ningún formato válido para tu país`
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
    title: `Invitar a {{name}}`,
    invitationTitle: `Invitación a...`,
    matchPlaceholder: `Se juega en {{place}}`,
    invalidPhoneNumber: "El jugador no cargó su teléfono. Probá con señales de humo. ",
    invalidPhoneNumberTitle: "Número inválido. ",
    invitationText: `Hola, {{playerName}}.\nTe contacto a través de *{{appName}}*.\nTe invito a un partido el *{{matchDate}} hs.* en *"{{matchPlace}}"*.\n{{matchLocationInfo}}\nSi te interesa, respondeme este mensaje por favor.`,
    invitationLocationText: `Por las dudas, te dejo el link de la ubicación del lugar.\n{{locationUrl}}\n`,
    invitationFooter: `Mensaje enviado desde *{{appName}}, _{{appSlogan}}_*\nPedí tu acceso de prueba a {{appContactEmail}}`,
  },
  playerCard: {
    fromDistance: `A {{distance}} km de distancia`
  },
  whatsapp: {
    buttonTitle: `Enviar un WhatsApp`,
    urlNotSupported: `Can't handle url: {{url}}`,
    urlUnkownError: `An error occurred.\n{{err}}`,
  }
}
