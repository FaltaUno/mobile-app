
import { Platform } from 'react-native';

export default {
  app: {
    name: `Falta uno!`,
    slogan: `La app que no te deja tirado`,
    contactEmail: `falta.uno.2018@gmail.com`
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
    service: {
      unkownError: `Ocurrió un error.\n{{error}}`,
    },
    error: {
      androidEmulator: `Oops, this will not work on Sketch in an Android emulator. Try it on your device!`,
      permissionDenied: `Permisos denegados`
    }
  },
  addMatch: {
    title: `Nuevo partido`,
    nameLabel: `Título del partido`,
    placeLabel: `¿Dónde?`,
    ...Platform.select({
      ios: {
        dateLabel: '¿Cuándo?',
      },
      android: {
        dateLabel: 'Fecha',
        timeLabel: 'Hora',
      },
    }),
    notesLabel: `Notas`,
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
  },
  welcome: {
    hi: {
      headerTitle: 'Hola',
      title: `Hola, {{displayName}}`,
      description: `Vamos a configurar la aplicación para sacarle el máximo provecho`,
      buttonLabel: `Comenzar`
    },
    phoneInput: {
      headerTitle: `Verificación`,
      title: `Ingresá tu teléfono...`,
      description: `Vamos enviarte un SMS de verificación`,
      disclaimer: `Puede que tu compañía telefónica te cobre la tarifa estándar por recibir el mensaje de verificación`,
      buttonLabelFinal: `Recibir código de verificación`,
      buttonLabel: `Ingresar código de invitación`,
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
      codeDoesNotMatch: `El código ingresado no es correcto`
    },
    phoneConfirmation: {
      headerTitle: `Bienvenid@`,
      title: `Bienvenid@`,
      description: `Tu teléfono {{phone}} está dentro de los usuario habilitados para la beta cerrada`,
      buttonLabel: `Continuar con la configuración`,
    },
    locationPermission: {
      headerTitle: `Localización`,
      title: `Localización`,
      description: `Queremos brindarte las mejores coincidencias dentro de la app`,
      detail1: `Por este motivo, leeremos tu ubicación cada vez que abras la aplicación para poder ofrecerte datos certeros de jugadores cercanos para que completes tus partidos.`,
      detail2: `De modo similar, actualizaremos en segundo plano tu ubicación una vez al día para ofrecerle a otros jugadores la posibilidad de invitarte a sus partidos.`,
      buttonLabel: `Habilitar geolocalización`,
      permissionNotGranted: `ERROR.\nLa aplicación requiere de los permisos de localización para poder funcionar.\nDe lo contrario no se puede continuar.`,
      permissionDeniedButtonLabel: `Ir a ajustes y habilitar localización`
    },
    configFinish: {
      headerTitle: `Todo listo`,
      title: `¡Todo listo!`,
      description: `Ya podés comenzar a buscar jugadores para tus partidos`,
      buttonLabel: `¡Empezar a utilizar la app!`,
    }
  }
}
