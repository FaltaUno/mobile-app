import Colors from '../constants/Colors'

export default {
  block: {
    buttonStyle: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 45,
      paddingRight: 30,
      backgroundColor: Colors.primary,
      borderRadius: 0
    },
    containerStyle: {
      marginTop: 15,
      marginBottom: 15,
      paddingLeft: 0,
      paddingRight: 0
    },
    textStyle: {
      width: '100%',
      textAlign: 'center',
    },
    loadingStyle: {
      width: '100%',
      paddingTop: 9,
      paddingBottom: 9,
    }
  },
  rounded: {
    buttonStyle: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 45,
      paddingRight: 30,
      backgroundColor: Colors.primary,
      borderRadius: 50
    },
    containerStyle: {
      marginTop: 20,
      paddingLeft: 20,
      paddingRight: 20
    },
    textStyle: {
      width: '100%',
      textAlign: 'center',
    }
  }
}
