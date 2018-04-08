let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function dispatch(action) {
  navigator.dispatch(action);
}

// add other navigation functions that you need and export them

export default {
  dispatch,
  setTopLevelNavigator
};
