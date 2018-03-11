# falta-uno-app

## Getting started
1. Clone the project
2. Run `npm install` (Recommended version of node `9.3.0`)
3. 

## Must have tools
1. React Native Tools
2. `react-native-cli`
3. https://github.com/expo/xde
4. [Expo] (http://expo.io/)

## Guía de desarrollo VSCode

### Configuración para debugging

Correr el comando `> React Native: Start Exponent Packager`. Dicho comando nos indicará el puerto que debemos configurar para poder debuggear la app desde el IDE.

Una vez levanta el packager, ir al archivo `/.expo/packager-info.json` y verificar el valor del parámetro `packagerPort`. Dicho valor debe incluirse en la configuración del ambiente desde el archivo `/.vscode/setting.json` (crear el archivo si aún no existe). En dicho archivo es necesario definir el parámetro `react-native.packager.port` con el valor verificado en `packagerPort`.

Habiendo copiado el puerto se puede parar el packager con el comando `> React Native: Stop Packager`. Luego en el archivo `/.expo/settings.json` (configuración de expo, no de ambiente).

```json
{
  "hostType": "lan",
  "lanType": "ip",
}
```

Para que el hotreload y los breakpoint sean tomados correctamente es necesario agregar lo siguiente al final del archivo `/.babelrc`

```json
{
  "sourceMaps": true,
}
```

## Beta cerrada

## Invitaciones

- Habilitar usuario de Facebook en la app de login
- Agregar un par `{ teléfono: códigoSeisDígitos }` en la tabla `/codes` en Firebase

Listo. Ese usuario ya puede ingresar a la beta cerrada.

## Desarrollo

### Iniciar el desarrollo

1. `Ctrl + Shift + P`
1. `> React Native: Start Exponent Packager`
1. Escanear el QA con el dispositivo o bien abrir la URL desde el simulador iOS.

#### Tip: Babel

Si se modifica el archivo de configuración de Babel `.babelrc` es necesario reiniciar el packager.

### Debugging

Para debuggear es necesario tener la configuración de "React Native" llamada "Attah to packager" en el archivo `/.vscode/launch.json`.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to packager",
            "program": "${workspaceRoot}/.vscode/launchReactNative.js",
            "type": "reactnative",
            "request": "attach",
            "sourceMaps": true,
            "outDir": "${workspaceRoot}/.vscode/.react"
        }
    ]
}
```

Luego:

1. Deshabilitar "Hot Reloading" o "Live Reload" si están habilitados.
1. `> React Native: Start Exponent Packager`
1. En la pestaña de debugging, tener seleccionado "Attach to pacakger"
1. Iniciar el debugging (`F5` o `> Start Debugging`) y esperar que la consola establece conexión con el Proxy (Packager) (la barra de estado seguirá en estado "Cargando...")
1. En el dispositivo/simulador elegir el modo de debugging deseado (Live Reload o Hot Reloading).
1. Configurar cualquier breakpoint y reiniciar la app.

Listo!
