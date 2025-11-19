export function Home() {
    const container = document.createElement("div");

    // Cargar HTML del componente
    fetch("./components/home/home.html")
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            // Inicializamos comportamiento
            inicializarEventos(container);
        });

    // Cargar CSS
    import("./components/home/home.css", { assert: { type: "css" } })
        .then(style => {
            document.adoptedStyleSheets.push(style.default);
        });

    return container;
}

function inicializarEventos(root) {
    const btnRegistrarse = root.querySelector("#btn-registrarse");
    const seccionRegistro = root.querySelector("#registro");

    btnRegistrarse.addEventListener("click", () => {
        seccionRegistro.classList.toggle("oculto");
    });

    // Login
    root.querySelector("#login-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const username = root.querySelector("#username").value;
        const password = root.querySelector("#password").value;

        alert(`Intentando iniciar sesión como: ${username}`);
        // Aquí llamás al backend: login(username, password)
    });

    // Registro
    root.querySelector("#registro-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const username = root.querySelector("#reg-username").value;
        const password = root.querySelector("#reg-password").value;

        alert(`Creando usuario: ${username}`);
        // Aquí llamás al backend: crearUsuario({ username, password })
    });
}
