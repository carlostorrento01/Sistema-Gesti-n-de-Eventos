

#  Sistema de Gestión de Eventos Comunitarios

Aplicación móvil desarrollada en **React Native + Expo Router**, diseñada para administrar eventos, asistencia, comentarios y estadísticas dentro de una comunidad local.
El sistema utiliza **AsyncStorage** para almacenar toda la información localmente (ideal para prototipos o demostraciones).

---

##  Características principales

###  Autenticación con roles

* **Administrador (admin)**
* **Usuario (user)**
* Validación local mediante `AuthContext`
* Protección de rutas para evitar accesos no autorizados

---

##  Gestión de Eventos

### Rol Administrador

* Crear eventos
* Editar eventos
* Eliminar eventos
* Ver lista completa (tabla estilo dashboard)
* Ver resumen: próximos, finalizados, total
* Consultar estadísticas de cada evento:

  * Total confirmados
  * Total asistencias
  * Promedio de calificación
  * Comentarios completos
* Acceso al historial general
* Cerrar sesión

###  Rol Usuario

* Ver eventos próximos y pasados
* Buscar eventos por nombre, ubicación o categoría
* Ver detalles completos
* Confirmar asistencia
* Comentar y calificar eventos donde asistió
* Cerrar sesión

---

##  Interacción Social

Cada evento permite:

* Comentarios individuales
* Calificaciones (1–5 estrellas)
* Listado de retroalimentación visible para el administrador

---

##  Estadísticas para Administradores

Cada evento tiene:

* Total de asistentes confirmados
* Conteo de "attended" y "no-show"
* Promedio general de calificaciones
* Lista detallada de comentarios

---

##  Diseño moderno (tema oscuro)

El sistema posee:

* Layout con fondo oscuro
* Tarjetas estilizadas
* Botones modernos
* Trayectoria de navegación clara
* Cabeceras personalizadas por rol

Ideal para presentaciones, maquetas o proyectos educativos.

---

##  Tecnologías Usadas

* **React Native**
* **Expo Router**
* **TypeScript**
* **AsyncStorage**
* **React Hooks**
* **Expo Go / Expo Web**

---

## Estructura del Proyecto

```
app/
│
├── auth/
│   └── login.tsx
│
├── eventos/
│   ├── index.tsx
│   └── [id].tsx
│
├── admin/
│   ├── eventos/
│   │   ├── index.tsx
│   │   └── form.tsx
│   └── historial/
│       ├── index.tsx
│       └── [id].tsx
│
├── _layout.tsx
│
contexts/
│   └── AuthContext.tsx
│
services/
    └── eventStorage.ts
```

---

## 🔧 Instalación y ejecución

###  Clonar el repositorio

```sh
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

###  Instalar dependencias

```sh
npm install
```

###  Iniciar Expo

```sh
npx expo start
```

###  Ejecutar en navegador (opcional)

```sh
npm run web
```

---

##  Credenciales por defecto

### Admin

```
usuario: admin
```

### Usuario normal

```
usuario: user
password: user123
```

*Estos valores pueden modificarse en `AuthContext.tsx`.*

---

##  Notas importantes

* Todos los datos se guardan con **AsyncStorage**
* Ideal para prototipos, pruebas y proyectos académicos
* No requiere backend externo
* Rol Admin está protegido contra accesos no autorizados

---

##  Licencia

Este proyecto puede utilizarse libremente con fines educativos o de demostración.

---

##  Autor

**Carlos Alberto Torrento Andino**
Sistema diseñado como parte de un proyecto académico.

--
