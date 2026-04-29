## 🌮 TaconMadre App
TaconMadre es una solución integral para la gestión de pedidos en restaurantes, desarrollada con React Native, Expo y Supabase. Permite a los clientes realizar pedidos personalizados y a los administradores gestionar las ordenes en tiempo real.

---

## 🚀 Características
-**Gestión de Carrito**: Persistencia de datos local para no perder pedidos.

-**Autenticación**: Sistema de usuarios (Admin/Cliente) vía Supabase.

-**Real-time**: Actualización de pedidos inmediata en el panel de administración.

-**Diseño Robusto**: Forzado a modo claro para garantizar visibilidad total.

## 🛠️ Configuración del Entorno
1. ## Variables de Entorno
Crea un archivo .env en la raíz del proyecto:
```text
    EXPO_PUBLIC_SUPABASE_URL=tu_url_supabase 
    EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_key_supabase
```

---
2. ## Importante: Solución de Errores de Sesión (Build)
Si al generar el APK tienes problemas de conexión o sesión debido a que las claves del .env no se inyectan correctamente, debes forzarlas en el archivo eas.json.

Agrega el bloque "env" dentro de tu perfil de build después de la configuración de Android:

```JSON
"android": {
  "buildType": "apk"
},
"env": {
  "EXPO_PUBLIC_SUPABASE_URL": "tu_url_supabase",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY": "tu_key_supabase"
}
```
---
3. ## 📱 Compilación y Despliegue
Este proyecto utiliza EAS Build. Para generar una versión de prueba (APK):

Instala las dependencias: 
```bash
npm install
```

Inicia sesión en Expo: 
```bash
npx eas login
```

Ejecuta el build:
```bash
eas build -p android --profile preview
```
- #Nota sobre UI: La aplicación está configurada en app.json para ignorar el modo oscuro del sistema operativo, asegurando que todos los textos (placeholders, IDs de orden, etc.) sean siempre legibles sobre el fondo blanco.

---

## 🛠️ Stack Tecnológico
- Frontend: React Native (Expo)

- Backend: Supabase (PostgreSQL + Auth)

- Persistencia: AsyncStorage

- Build Tool: EAS CLI