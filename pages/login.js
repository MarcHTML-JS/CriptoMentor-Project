document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('usuarioLogueado')) {
        window.location.href = 'Inicio.html';
        return;
    }

    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const iconEye = document.getElementById('iconEye');
    const iconEyeOff = document.getElementById('iconEyeOff');

    togglePassword.addEventListener('click', () => {
        const isHidden = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isHidden ? 'text' : 'password');
        iconEye.hidden = isHidden;
        iconEyeOff.hidden = !isHidden;
        togglePassword.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    const loginForm = document.getElementById('loginform');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');
    const googleLoginBtn = document.getElementById('googleLoginBtn');

    function mostrarErrorVisual(inputElement) {
        inputElement.classList.add('error');
        setTimeout(() => {
            inputElement.classList.remove('error');
        }, 400);
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let hayError = false;

        if (email === '') {
            mostrarErrorVisual(emailInput);
            hayError = true;
        }

        if (password === '') {
            mostrarErrorVisual(passwordInput);
            hayError = true;
        }

        if (hayError) return;

        submitBtn.textContent = 'Verificando...';
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
            localStorage.setItem('usuarioLogueado', email);
            window.location.href = 'Inicio.html';
        }, 800);
    });

    googleLoginBtn.addEventListener('click', () => {
        googleLoginBtn.textContent = 'Conectando con Google...';
        googleLoginBtn.style.opacity = '0.7';

        setTimeout(() => {
            localStorage.setItem('usuarioLogueado', 'usuario_google@gmail.com');
            window.location.href = 'Inicio.html';
        }, 1000);
    });
});