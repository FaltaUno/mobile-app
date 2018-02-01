export default {
  app: {
    name: `Falta uno!`,
    slogan: `La app que no te deja tirado`,
  },
  addMatch: {
    title: `Nuevo partido`,
    nameLabel: `Nombre del partido`,
    placeLabel: `¿Dónde se juega?`,
    dateLabel: `¿Cuándo?`
  },
  action: {
    add: `Agregar`,
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
    noMatchesAvailable: `No tenés ningún partido`,
    addMatch: `Agregar partido`
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
    defaultText: "Hola, falta uno para jugar. Te interesa?",
    invalidPhoneNumber: "El jugador no cargó su teléfono. Probá con señales de humo. ",
    invalidPhoneNumberTitle: "Número inválido. "
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
