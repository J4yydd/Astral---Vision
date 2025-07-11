document.addEventListener('DOMContentLoaded', function() {
    navegacionFija()
    crearGaleria()
    resaltarEnlace()
    scrollNav()
    initCountdown()
    initBackToTop()
    initLoadingSpinner()
    initMobileOptimizations()
})

function navegacionFija() {
    const header = document.querySelector('.header')
    const sobreFestival = document.querySelector('.sobre-festival')

    document.addEventListener('scroll', function() {
        if(sobreFestival.getBoundingClientRect().bottom < 1) {
            header.classList.add('fixed')
        } else {
            header.classList.remove('fixed')
        }
    })
}

function crearGaleria() {
    const CANTIDAD_IMAGENES = 16
    const galeria = document.querySelector('.galeria-imagenes')

    for(let i = 1; i <= CANTIDAD_IMAGENES; i++) {
        const imagen = document.createElement('IMG')
        imagen.src = `src/img/gallery/full/${i}.jpg`
        imagen.alt = 'Imagen Galería'
        imagen.loading = 'lazy' // Optimización para móviles

        // Event Handler
        imagen.onclick = function() {
            mostrarImagen(i)
        }
        
        galeria.appendChild(imagen)
    }
}

function mostrarImagen(i) {
    const imagen = document.createElement('IMG')
    imagen.src = `src/img/gallery/full/${i}.jpg`
    imagen.alt = 'Imagen Galería'

    // Generar Modal
    const modal = document.createElement('DIV')
    modal.classList.add('modal')
    modal.onclick = cerrarModal

    // Contenedor para botones
    const botonesContainer = document.createElement('DIV')
    botonesContainer.classList.add('modal-botones')

    // Botón cerrar modal
    const cerrarModalBtn = document.createElement('BUTTON')
    cerrarModalBtn.innerHTML = '<i class="fas fa-times"></i>'
    cerrarModalBtn.classList.add('btn-cerrar')
    cerrarModalBtn.onclick = cerrarModal

    // Botón descargar imagen
    const descargarBtn = document.createElement('BUTTON')
    descargarBtn.innerHTML = '<i class="fas fa-download"></i>'
    descargarBtn.classList.add('btn-descargar')
    descargarBtn.title = 'Descargar imagen'
    descargarBtn.onclick = function(e) {
        e.stopPropagation()
        descargarImagen(i)
    }

    // Botón compartir (nuevo)
    const compartirBtn = document.createElement('BUTTON')
    compartirBtn.innerHTML = '<i class="fas fa-share-alt"></i>'
    compartirBtn.classList.add('btn-compartir')
    compartirBtn.title = 'Compartir imagen'
    compartirBtn.onclick = function(e) {
        e.stopPropagation()
        compartirImagen(i)
    }

    // Botón para guardar en galería (especialmente para iOS)
    const guardarBtn = document.createElement('BUTTON')
    guardarBtn.innerHTML = '<i class="fas fa-save"></i>'
    guardarBtn.classList.add('btn-guardar')
    guardarBtn.title = 'Guardar en galería'
    guardarBtn.onclick = function(e) {
        e.stopPropagation()
        guardarEnGaleria(i)
    }

    botonesContainer.appendChild(guardarBtn)
    botonesContainer.appendChild(compartirBtn)
    botonesContainer.appendChild(descargarBtn)
    botonesContainer.appendChild(cerrarModalBtn)

    modal.appendChild(imagen)
    modal.appendChild(botonesContainer)

    // Agregar al HTML
    const body = document.querySelector('body')
    body.classList.add('overflow-hidden')
    body.appendChild(modal)

    // Agregar animación de entrada
    setTimeout(() => {
        modal.classList.add('modal-active')
    }, 10)
}

function descargarImagen(i) {
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
        // Para móviles, usar una estrategia diferente
        descargarImagenMobile(i)
    } else {
        // Para desktop, usar el método tradicional
        descargarImagenDesktop(i)
    }
}

function descargarImagenDesktop(i) {
    const link = document.createElement('a')
    link.href = `src/img/gallery/full/${i}.jpg`
    link.download = `astral-vision-galeria-${i}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    mostrarNotificacion('Imagen descargada exitosamente')
}

function descargarImagenMobile(i) {
    const url = `src/img/gallery/full/${i}.jpg`
    
    // Intentar usar la API de descarga nativa si está disponible
    if ('download' in document.createElement('a')) {
        // Crear un enlace temporal y hacer clic
        const link = document.createElement('a')
        link.href = url
        link.download = `astral-vision-galeria-${i}.jpg`
        link.target = '_blank'
        
        // Para iOS, necesitamos una estrategia diferente
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            // En iOS, abrir en nueva pestaña y mostrar instrucciones
            const nuevaVentana = window.open(url, '_blank')
            if (nuevaVentana) {
                mostrarNotificacion('Imagen abierta. Mantén presionada para guardar en galería')
            } else {
                mostrarNotificacion('Bloqueador de ventanas detectado. Usa el botón compartir.')
            }
        } else {
            // Para Android y otros móviles
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            mostrarNotificacion('Descarga iniciada. Revisa tu galería.')
        }
    } else {
        // Fallback: usar fetch para descargar la imagen
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = blobUrl
                link.download = `astral-vision-galeria-${i}.jpg`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(blobUrl)
                mostrarNotificacion('Descarga completada. Revisa tu galería.')
            })
            .catch(() => {
                // Último fallback: abrir en nueva pestaña
                const nuevaVentana = window.open(url, '_blank')
                if (nuevaVentana) {
                    mostrarNotificacion('Imagen abierta. Mantén presionada para guardar.')
                } else {
                    mostrarNotificacion('Usa el botón compartir para guardar la imagen.')
                }
            })
    }
}

function guardarEnGaleria(i) {
    const url = `src/img/gallery/full/${i}.jpg`
    
    // Detectar si es iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    if (isIOS) {
        // Para iOS, usar una estrategia específica
        const nuevaVentana = window.open(url, '_blank')
        if (nuevaVentana) {
            mostrarNotificacion('Imagen abierta. Mantén presionada y selecciona "Guardar imagen"')
        } else {
            mostrarNotificacion('Bloqueador detectado. Usa el botón compartir.')
        }
    } else {
        // Para Android y otros, usar el método de descarga normal
        descargarImagenMobile(i)
    }
}

function compartirImagen(i) {
    const url = `src/img/gallery/full/${i}.jpg`
    const texto = '¡Mira esta foto del festival Astral Vision!'
    
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (navigator.share && isMobile) {
        // Usar Web Share API en móviles
        navigator.share({
            title: 'Astral Vision Festival',
            text: texto,
            url: window.location.origin + '/' + url
        }).then(() => {
            mostrarNotificacion('Contenido compartido')
        }).catch(() => {
            // Si falla el share, intentar descargar
            descargarImagenMobile(i)
        })
    } else if (isMobile) {
        // Para móviles sin Web Share API, intentar descargar directamente
        descargarImagenMobile(i)
    } else {
        // Para desktop, copiar URL al portapapeles
        const urlCompleta = window.location.origin + '/' + url
        navigator.clipboard.writeText(urlCompleta).then(() => {
            mostrarNotificacion('URL copiada al portapapeles')
        }).catch(() => {
            mostrarNotificacion('No se pudo compartir')
        })
    }
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div')
    notificacion.classList.add('notificacion')
    notificacion.textContent = mensaje
    
    document.body.appendChild(notificacion)
    
    setTimeout(() => {
        notificacion.classList.add('notificacion-activa')
    }, 100)
    
    setTimeout(() => {
        notificacion.classList.remove('notificacion-activa')
        setTimeout(() => {
            notificacion.remove()
        }, 300)
    }, 3000)
}

function cerrarModal() {
    const modal = document.querySelector('.modal')
    if (modal) {
        modal.classList.add('fade-out')
        
        setTimeout(() => {
            modal?.remove()
            const body = document.querySelector('body')
            body.classList.remove('overflow-hidden')
        }, 500)
    }
}

function resaltarEnlace() {
    document.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section')
        const navLinks = document.querySelectorAll('.navegacion-principal a')

        let actual = '';
        sections.forEach( section => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight
            if(window.scrollY >= (sectionTop - sectionHeight / 3 ) ) {
                actual = section.id
            }
        })

        navLinks.forEach(link => {
            link.classList.remove('active')
            if(link.getAttribute('href') === '#' + actual) {
                link.classList.add('active')
            }
        })
    })
}

function scrollNav() {
    const navLinks = document.querySelectorAll('.navegacion-principal a')

    navLinks.forEach( link => {
        link.addEventListener('click', e => {
            e.preventDefault()
            const sectionScroll = e.target.getAttribute('href')
            const section = document.querySelector(sectionScroll)

            section.scrollIntoView({behavior: 'smooth'})
        })
    })
}

function initCountdown() {
    const eventDate = new Date('2024-07-11T20:00:00').getTime()
    
    function updateCountdown() {
        const now = new Date().getTime()
        const distance = eventDate - now
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0')
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0')
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0')
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0')
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<h3>¡El evento ya comenzó!</h3>'
        }
    }
    
    updateCountdown()
    setInterval(updateCountdown, 1000)
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop')
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('back-to-top-visible')
        } else {
            backToTopBtn.classList.remove('back-to-top-visible')
        }
    })
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })
}

function initLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner')
    
    window.addEventListener('load', () => {
        spinner.classList.add('loading-spinner-hidden')
        setTimeout(() => {
            spinner.style.display = 'none'
        }, 500)
    })
}

function initMobileOptimizations() {
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
        // Agregar clase para estilos específicos de móvil
        document.body.classList.add('mobile-device')
        
        // Optimizar imágenes para móviles
        const imagenes = document.querySelectorAll('img')
        imagenes.forEach(img => {
            img.loading = 'lazy'
        })
        
        // Mejorar la navegación táctil
        const navLinks = document.querySelectorAll('.navegacion-principal a')
        navLinks.forEach(link => {
            link.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)'
            })
            link.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)'
            })
        })
    }
}

// Agregar funcionalidad para los botones de compra
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-comprar')) {
        e.preventDefault()
        mostrarNotificacion('Función de compra en desarrollo')
    }
})