const MenuData = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: "dashboard", // Usamos emojis como iconos por simplicidad
        permission: null, // Solo se muestra si tiene el permiso VER_DASHBOARD
    },/*
    {
        title: "Usuarios",
        path: "/usuarios",
        icon: "users", // Usamos emojis como iconos por simplicidad
        permission: "USUARIOS", // Solo se muestra si tiene el permiso VER_DASHBOARD
    },
    {
        title: "Configuración",
        path: "/config",
        icon: "config",
        permission: null,
        seccion: "configuracion",
    },*/
    {
        title: "Cards",
        path: "/cards",
        icon: "cards", // Usamos emojis como iconos por simplicidad
        permission: "CARDS", // Solo se muestra si tiene el permiso VER_DASHBOARD
    
    }
];

export default MenuData;