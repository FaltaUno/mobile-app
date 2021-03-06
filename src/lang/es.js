import { Platform } from "react-native";

export default {
  app: {
    name: `Falta uno!`,
    slogan: `La app que no te deja tirado`,
    contactEmail: `falta.uno.2018@gmail.com`
  },
  action: {
    add: `Agregar`,
    delete: `Eliminar`,
    done: `OK`,
    edit: `Editar`,
    close: `Cerrar`,
    cancel: `Cancelar`
  },
  home: {
    title: `Cerca tuyo`,
    placeholder: `Escribe para filtrar`,
    noPlayers: `No hay jugadores disponibles por ahora`
  },
  login: {
    loginWithFacebook: `Ingresar con Facebook`,
    logging: `Ingresando...`,
    error: {
      auth: `Ocurrió un error al guardar la autorización.\nIntentá nuevamente más tarde`,
      user_cancelled: `Cancelaste el proceso.\nPara ingresar tenés que autorizar la aplicación.`
    },
    success: `¡Proceso completado con éxito!`
  },
  loading: `Cargando...`,
  location: {
    service: {
      unkownError: `Ocurrió un error.\n{{error}}`
    },
    error: {
      androidEmulator: `Oops, this will not work on Sketch in an Android emulator. Try it on your device!`,
      permissionDenied: `Permisos denegados`
    }
  },
  addMatch: {
    title: `Nuevo partido`,
    nameLabel: `Título del partido`,
    playersNeededLabel: `Me faltan`,
    playerNeededLabel: `Me falta`,
    playersNeededPlaceholder: `Mín: 1`,
    placeLabel: `¿Dónde?`,
    placePlaceholder: `Sin definir`,
    addressLabel: `Dirección`,
    ...Platform.select({
      ios: {
        dateLabel: "¿Cuándo?"
      },
      android: {
        dateLabel: "Fecha",
        timeLabel: "Hora"
      }
    }),
    notesLabel: `Notas`,
    noNameDefined: `Indica el título del partido`,
    noLocationDefined: `Debes indicar el lugar donde se jugará el partido`,
    noPlayersNeededDefined: `Debes indicar la cantidad de jugadores que precisás para tu partido`
  },
  matchSelector: {
    title: `Selección de partido`,
    label: `¿A qué partido querés invitar a {{displayName}}?`
  },
  myMatches: {
    title: `Mis partidos`
  },
  myMatch: {
    loadingInvitesInfo: `Cargando info de invitaciones`,
    noPlayersNeeded: `No se necesitan jugadores para este partido`,
    approvedPlayersOutOfTotal: `{{approved}} de {{total}} jugadores aprobados`,
    noNotes: `No se agregaron notas`,
    invitesLabel: `Jugadores`,
    inviteAction: `Invitar`,
    shareButtonLabel: `Invitar`,
    requestedInvitesLabel: `Pendientes de revisión`,
    noPendingInvites: `No hay pedidos de invitación pendientes`,
    approvedInvitesLabel: `Aprobados`,
    noApprovedInvites: `No hay jugadores aprobados`,
    rejectedInvitesLabel: `Rechazados`,
    noRejectedInvites: `No hay jugadores rechazados`
  },
  matches: {
    noAvailable: `No tenés ningún partido`,
    addMatch: `Agregar partido`,
    deleteMatch: `Eliminar`
  },
  match: {
    inviteButtonText: `Invitar jugadores`,
    invitationTitle: `Invitar jugadores`,
    invitationDialogTitle: `Invitar jugadores`,
    invitationText: `Hola. Me faltan jugadores para mi partido que se juega {{matchDateOn}}*{{matchDate}} hs.* en *"{{matchPlace}}"*.\nSi te interesa, sumate mediante el siguiente enlace.\n`,
    on: `el`
  },
  nearMatches: {
    title: `Partidos cerca`,
    noMatches: `No hay partidos cercanos`
  },
  matchDetails: {
    title: `Detalles del partido`
  },
  matchCard: {
    organizedBy: `Organizado por {{organizer}}`,
    organizer: `Organizador`,
    requestInvite: `¡Quiero jugar!`,
    remainingSpots: `Quedan {{spots}} lugares`,
    place: `Lugar`,
    date: `Fecha`,
    requestInviteSent: `Pedido enviado`,
    requestInviteApproved: `¡Fuiste convocado!`
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
    invalidPhoneNumber: `El número telefónico ingresado no coincide con ningún formato válido para tu país`,
    welcomeTourLabel: `Configuración inicial`
  },
  country: {
    placeholder: `País`,
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
    title: `Detalles del partido`,
    invitationTitle: `Invitación a...`,
    matchPlaceholder: `Se juega en {{place}}`,
    invalidPhoneNumber:
      "El jugador no cargó su teléfono. Probá con señales de humo. ",
    invalidPhoneNumberTitle: "Número inválido. ",
    invitationText: `Hola, {{playerName}}.\nTe contacto a través de *{{appName}}*.\nTe invito a un partido el {{matchDate}} hs. en *{{matchPlace}}*.\n{{matchLocationInfo}}\nSi te interesa, respondeme este mensaje por favor.`,
    invitationLocationText: `Por las dudas, te dejo el link de la ubicación del lugar.\n{{locationUrl}}\n`,
    invitationFooter: `Mensaje enviado desde *{{appName}}, _{{appSlogan}}_*\nPedí tu acceso de prueba a {{appContactEmail}}`
  },
  playerCard: {
    fromDistance: `A {{distance}} km de distancia`
  },
  error: {
    urlNotSupported: `No se puede abrir la url: {{url}}`
  },
  whatsapp: {
    buttonTitle: `Invitar por WhatsApp`,
    urlNotSupported: `No se puede abrir la url: {{url}}`,
    urlUnkownError: `Ocurrió un error.\n{{err}}`,
    contactAdminForMatch: `Hola, {{creatorName}}.\nSoy {{userName}} y te contacto para saber más acerca del partido "{{matchName}}" que se juegan en *{{matchPlace}}* el {{matchDate}} hs.`
  },
  welcome: {
    hi: {
      headerTitle: "Antes de empezar...",
      title: `Hola, {{displayName}}`,
      description: `Vamos a configurar la aplicación para sacarle el máximo provecho`,
      buttonLabel: `Comenzar`
    },
    phoneInput: {
      headerTitle: `Verificación`,
      title: `Ingresá tu teléfono...`,
      description: `Tené a mano tu código de invitación`,
      disclaimer: "",
      buttonLabel: `Ingresar código de invitación`,
      descriptionFinal: `Vamos enviarte un SMS de verificación`,
      disclaimerFinal: `Puede que tu compañía telefónica te cobre la tarifa estándar por recibir el mensaje de verificación`,
      buttonLabelFinal: `Recibir código de verificación`,
      backText: "Bienvenida"
    },
    phoneVerificationFinal: {
      headerTitle: `Confirmación`,
      title: `Revisá tu teléfono`,
      description: `Te enviamos el código al\n{{phone}}`,
      buttonLabel: `Ingresá tu código`
    },
    phoneVerification: {
      headerTitle: `Invitación`,
      title: `Ingresá tu invitación`,
      description: `Escribí el código que te proveímos para el número {{phone}}`,
      buttonLabel: `Ingresá tu código`,
      phoneNumberDisabled: `El número de teléfono\n{{phone}}\nno está habilitado para ingresar a la beta cerrada.`,
      codeDoesNotMatch: `El código ingresado no es correcto`,
      backText: `Ingresar Teléfono`
    },
    phoneConfirmation: {
      headerTitle: `Confirmada`,
      title: `Invitación confirmada`,
      description: `Tu teléfono {{phone}} está dentro de los usuario habilitados para la beta cerrada`,
      buttonLabel: `Continuar configurando`,
      backText: `Código de confirmación`
    },
    locationPermission: {
      headerTitle: `Localización`,
      title: `Localización`,
      description: `Queremos brindarte las mejores coincidencias dentro de la app`,
      detail1: `Leeremos tu ubicación al abrir la app para poder ofrecerte datos certeros de jugadores cercanos para que completes tus partidos.`,
      detail2: `También, actualizaremos en segundo plano tu ubicación una vez al día para ofrecerte partidos cercanos.`,
      buttonLabel: `Habilitar geolocalización`,
      permissionNotGranted: `ERROR.\nLa aplicación requiere de los permisos de localización para poder funcionar.\nDe lo contrario no se puede continuar.`,
      goToSettingsButtonLabel: `Ir a ajustes y habilitar localización`,
      permissionCheckButtonLabel: `Verificar geolocalización`,
      noLocationServicesEnabled: `No se detectó ningún servicio de geolocalización habilitado. No se puede continuar`,
      backText: `Confirmación de código`
    },
    configFinish: {
      headerTitle: `Todo listo`,
      title: `¡Todo listo!`,
      description: `Ya podés comenzar a buscar jugadores para tus partidos`,
      buttonLabel: `¡Empezar a utilizar la app!`,
      backText: `Geolocalización`
    }
  },
  approvedPlayersList: {
    title: "Jugadores aprobados",
    emptyList: "No aprobaste a ningún jugador"
  }
};
