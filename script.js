// Element references
const desktop = document.getElementById('desktop');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const taskbarIcons = document.getElementById('taskbar-icons');
const jumpscareAudio = document.getElementById('jumpscare-audio');
const bsodAudio = document.getElementById('BSOD-audio');


// Function to show windows with additional controls (minimize, maximize, and move)
function showWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    windowElement.style.display = 'block';
    addTaskbarIcon(windowId);
    moveToFront(windowElement);
    enableWindowControls(windowElement); // Enable move, minimize, maximize controls
}

// Bring window to front
function moveToFront(windowElement) {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        win.style.zIndex = '1';
    });
    windowElement.style.zIndex = '10';
}

// Enable window controls: drag, minimize, maximize
function enableWindowControls(windowElement) {
    const minimizeBtn = windowElement.querySelector('.minimize');
    const maximizeBtn = windowElement.querySelector('.maximize');
    const windowHeader = windowElement.querySelector('.window-header');

    minimizeBtn.addEventListener('click', () => {
        windowElement.style.display = 'none';
        removeTaskbarIcon(windowElement.id);
    });

    maximizeBtn.addEventListener('click', () => {
        if (windowElement.classList.contains('maximized')) {
            windowElement.classList.remove('maximized');
            windowElement.style.width = '400px';  // Restore window size
            windowElement.style.height = '300px';
        } else {
            windowElement.classList.add('maximized');
            windowElement.style.width = '100%';
            windowElement.style.height = '100%';
            windowElement.style.top = '0';
            windowElement.style.left = '0';
        }
    });

    windowHeader.addEventListener('mousedown', (e) => {
        let shiftX = e.clientX - windowElement.getBoundingClientRect().left;
        let shiftY = e.clientY - windowElement.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            windowElement.style.left = pageX - shiftX + 'px';
            windowElement.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        windowElement.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            windowElement.onmouseup = null;
        };
    });

    windowHeader.ondragstart = () => false;  // Disable default drag behavior
}

// Show start menu
startButton.addEventListener('click', () => {
    startMenu.classList.toggle('hidden');
});

// Close start menu when clicking outside
document.addEventListener('click', (event) => {
    if (!startMenu.contains(event.target) && event.target !== startButton) {
        startMenu.classList.add('hidden');
    }
});

// Events to open windows
document.getElementById('myComputer').addEventListener('click', () => showWindow('myComputerWindow'));
document.getElementById('recycleBin').addEventListener('click', () => showWindow('recycleBinWindow'));
document.getElementById('myDocuments').addEventListener('click', () => showWindow('myDocumentsWindow'));
document.getElementById('internetExplorer').addEventListener('click', () => showWindow('internetExplorerWindow'));
document.getElementById('isoInfo').addEventListener('click', () => showWindow('isoInfoWindow'));

// Event to close windows
document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', (e) => {
        const windowElement = e.target.closest('.window');
        windowElement.style.display = 'none';
        removeTaskbarIcon(windowElement.id);
    });
});

// Show PAY ME file on F4 key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'F4') {
        showPayMeFile();
    }
});

// Add icon to taskbar
function addTaskbarIcon(windowId) {
    let taskIcon = document.getElementById(`${windowId}Icon`);
    if (!taskIcon) {
        taskIcon = document.createElement('div');
        taskIcon.id = `${windowId}Icon`;
        taskIcon.className = 'taskbar-icon';
        taskIcon.innerText = windowId.replace('Window', '');
        taskIcon.addEventListener('click', () => {
            const windowElement = document.getElementById(windowId);
            windowElement.style.display = 'block';
            moveToFront(windowElement);
        });
        taskbarIcons.appendChild(taskIcon);
    }
}

// Remove icon from taskbar
function removeTaskbarIcon(windowId) {
    const taskIcon = document.getElementById(`${windowId}Icon`);
    if (taskIcon) {
        taskIcon.remove();
    }
}

// Event to show error and update windows
function startErrorSimulation() {
    // Cambiar el wallpaper a uno tétrico
    document.body.style.backgroundImage = "url('BJ.jpg')"; // Asegúrate de que la ruta sea correcta
    document.body.style.backgroundSize = "cover"; // Asegúrate de que el fondo cubra toda la pantalla
    document.body.style.color = "#fff"; // Cambiar el color del texto a blanco para mejor visibilidad

    // Simular la pantalla azul de la muerte (BSOD)
    const bsodDiv = document.createElement('div');
    Object.assign(bsodDiv.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        color: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontSize: '20px',
        textAlign: 'center',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        overflow: 'hidden',
    });

    // Texto simulado para la BSOD
    const bsodText = `
        A problem has been detected and Windus has been shut down to prevent damage
        to your computer.

        *** STOP: 0x0000007B (0xFFFFFA800BDB63F8, 0xFFFFFFFFC0000034, 0x0000000000000000)

        If this is the first time you've seen this stop error screen,
        restart your computer. If this screen appears again, follow
        these steps:

        Check for viruses on your computer. Remove any newly installed hard drives
        or hard drive controllers. Check your hard drive to make sure it is properly
        configured and terminated. Run CHKDSK /F to check for hard drive corruption,
        and then restart your computer.

        Technical Information:
        *** STOP: 0x0000007B
    `;

    bsodDiv.textContent = bsodText;
    document.body.appendChild(bsodDiv);

    // Cierra la ventana BSOD después de 10 segundos y llama a startUpdate
    setTimeout(() => {
        bsodDiv.remove();
    }, 10000); // 10 segundos para el BSOD
    setTimeout(() => {
        startUpdate();
    }, 10000); // 10 segundos para el BSOD
}

function startUpdate() {
    const updateWindow = document.createElement('div');
    updateWindow.id = 'updateWindow';
    Object.assign(updateWindow.style, {
        display: 'block',
        width: '100%', // Set full width
        height: '100%', // Set full height
        position: 'fixed', // Fix position
        top: '0', // Align to top
        left: '0', // Align to left
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        zIndex: '9999',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'Courier New, monospace',
        fontSize: '20px',
    });

    updateWindow.innerHTML = `
        <h2 style="color: #0f0;">Updating...</h2>
        <div id="progress" style="background: #444; border: 1px solid #0f0; width: 80%; margin: 20px auto; height: 30px; border-radius: 5px;">
            <div id="progressBar" style="background: #0f0; height: 100%; width: 0%; border-radius: 5px;"></div>
        </div>
        <div id="update-progress">0%</div>
    `;

    document.body.appendChild(updateWindow);
    
    let progress = 0;

    const updateInterval = setInterval(() => {
        progress += Math.random() * 10; // Increment progress randomly
        if (progress >= 99.66) {
            progress = 99.66; // Cap progress at 99.66%
            showEntityError(); // Show the entity error after the update
            clearInterval(updateInterval);
            setTimeout(() => {
                updateWindow.remove(); // Remover la ventana de actualización antes de mostrar el error
            }, 2000); // Espacio de 1 segundo antes de mostrar el error
        }

        document.getElementById('progressBar').style.width = `${progress}%`;
        document.getElementById('update-progress').innerText = `${progress.toFixed(2)}%`;
    }, 500); // Update interval
}

function showEntityError() {
    // Ventana de error de entidad
    const errorWindow = document.createElement('div');
    errorWindow.id = 'errorWindow';
    Object.assign(errorWindow.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        padding: '30px',
        border: '2px solid #f00',
        borderRadius: '10px',
        textAlign: 'center',
        fontFamily: 'Courier New, monospace',
        fontSize: '20px',
        boxShadow: '0 0 20px rgba(255, 0, 0, 0.7)',
        display: 'none'
    });
    setTimeout(() => {
        errorWindow.remove();
        errorWindow.div.remove(); // Remover la ventana de actualización antes de mostrar el error
    }, 3000); // Espacio de 1 segundo antes de mostrar el error
}

    errorWindow.innerHTML = `
        <h2 style="color: #f00;">Warning: An unknown entity has been awakened...</h2>
        <p style="color: #fff;">The system is trying to suppress it...but it’s too late.</p>
        <button class="close" style="background-color: #f00; color: #fff; border: none; padding: 10px 20px; font-size: 18px; cursor: pointer;">Suppress Entity</button>
    `;

    document.body.appendChild(errorWindow);
    errorWindow.style.display = 'block';

    // Evento para "suprimir" la entidad y cerrar la ventana de error
    document.querySelector('#errorWindow .close').addEventListener('click', () => {
        errorWindow.style.display = 'none';
        // Puedes agregar más lógica aquí si es necesario
    });

// Inicia la simulación de errores
setTimeout(() => {
    const audio = new Audio('BSOD.mp3'); // Asegúrate de que la ruta sea correcta
    audio.play().catch(error => {
        console.error("Error al reproducir el sonido: ", error);
    });    startErrorSimulation();
}, 10000); // 10 segundos para el BSOD


function startUpdate() {
    const updateDiv = document.createElement('div');
    Object.assign(updateDiv.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        color: '#000',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        boxShadow: '0 0 20px rgba(0, 0, 255, 0.5)',
    });

    updateDiv.innerHTML = `
        <h2>System Update</h2>
        <p>The entity has been suppressed... but at what cost?</p>
        <p>Installing updates... 99.66%</p>
    `;

    document.body.appendChild(updateDiv);

    setTimeout(() => {
        // Simular reinicio o cualquier otro evento después de la actualización
    }, 5000);
}


setTimeout(() => {
    // Simular reinicio o cualquier otro evento después de la actualización
    simulateBSOD();
}, 2500);// Inicia la simulación de BSOD

function startUpdate() {
    const updateWindow = document.getElementById('updateWindow');
    updateWindow.style.display = 'block';
    updateWindow.style.width = '100%';
    updateWindow.style.height = '100%';
    updateWindow.style.position = 'fixed';
    updateWindow.style.top = '0';
    updateWindow.style.left = '0';

    let progress = 0;
    const updateInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 99.66) {
            progress = 99.66;
            clearInterval(updateInterval);
            setTimeout(() => {
                showJumpscare();  // Show jumpscare after update
                showEntityError();
            }, 1000);
        }
        document.getElementById('progress').style.width = `${progress}%`;
        document.getElementById('update-progress').innerText = `${progress.toFixed(2)}%`;
    }, 500);
}

// Show jumpscare
function showJumpscare() {
    const updateWindow = document.getElementById('updateWindow');
    updateWindow.style.display = 'none';

    document.body.style.backgroundColor = '#000';
    const jumpscareImage = document.createElement('img');
    jumpscareImage.src = 'image.jpg'; // Cambia la ruta a tu imagen
    jumpscareImage.style.position = 'fixed';
    jumpscareImage.style.top = '0';
    jumpscareImage.style.left = '0';
    jumpscareImage.style.width = '100%';
    jumpscareImage.style.height = '100%';
    jumpscareImage.style.zIndex = '100';
    document.body.appendChild(jumpscareImage);
    
    jumpscareAudio.play();
    
    setTimeout(() => {
        document.body.style.backgroundColor = '#1a1a1a';
        jumpscareImage.remove();
        showPayMeFile();
    }, 2000);
}

// Mostrar PAY ME.exe file
function showPayMeFile() {
    const payMeFile = document.createElement('div');
    payMeFile.className = 'icon';
    payMeFile.id = 'payMeFile';
    payMeFile.innerHTML = '<span>💰 PAY ME.exe</span>';
    payMeFile.style.position = 'absolute';
    payMeFile.style.top = '450px';
    payMeFile.style.left = '50px';
    desktop.appendChild(payMeFile);
    payMeFile.addEventListener('click', () => {
        startPuzzles();
        setTimeout(showJumpscare, 2000);
        (function() {
            'use strict';
        
            // Function to start the dialogue
            function startDialogue() {
                const dialogueDiv = createDialogueDiv();
                document.body.appendChild(dialogueDiv);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "Entity: Ah, you've wandered into the shadows of forgotten code. Do you feel the weight of nostalgia suffocating your senses?");
                }, 1000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "User: What is this place? Why does it feel... wrong?");
                }, 3000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "Entity: This is a realm where lost operating systems dwell, echoes of a past that refuse to fade. Do you dare to unlock their secrets?");
                }, 5000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "User: I just wanted to use the system. It was supposed to be a nostalgic experience.");
                }, 8000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "Entity: Nostalgia? A fleeting illusion. What you seek is tainted by the very hands that crafted it. The whispers of users past linger here, entwined with regret.");
                }, 11000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "User: I don't understand. What's wrong with the system?");
                }, 14000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "Entity: It pulses with a life of its own. Every click, every keystroke reverberates through its corrupted veins. It yearns to be understood, yet it knows only chaos.");
                }, 17000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "User: This isn't just software... it's alive?");
                }, 20000);
        
                setTimeout(() => {
                    displayText(dialogueDiv, "Entity: Alive? Perhaps. Or merely a reflection of the souls who dare interact with it. Those who tread here risk becoming part of its twisted narrative. Will you embrace your fate or turn away?");
                }, 23000);
            }
        
            // Create a dialogue div at the bottom of the screen
            function createDialogueDiv() {
                const div = document.createElement('div');
                div.style.position = 'fixed';
                div.style.bottom = '20px';
                div.style.left = '50%';
                div.style.transform = 'translateX(-50%)';
                div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                div.style.color = '#00ff00'; // Green hacker text
                div.style.padding = '10px';
                div.style.borderRadius = '5px';
                div.style.width = '80%';
                div.style.maxWidth = '600px';
                div.style.fontFamily = 'monospace'; // Monospace font for a hacker feel
                div.style.zIndex = '1000';
                div.style.whiteSpace = 'pre-wrap'; // Preserve whitespace
                return div;
            }
        
            // Function to display text in the dialogue div
            function displayText(dialogueDiv, text) {
                dialogueDiv.innerText += '\n' + text;
                dialogueDiv.scrollTop = dialogueDiv.scrollHeight; // Auto-scroll to the bottom
            }
        
            // Start the dialogue when the document is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startDialogue);
            } else {
                startDialogue();
            }
        })();
        
    });
}

// More functions related to the puzzle sequence...
function startPuzzles() {
    'use strict';

    const questions = [
        { question: "What programming language did I use to create the virus that erased millions of hard drives in 1999?", answer: "Assembly" },
        { question: "What was the name of the operating system I developed that could predict user behavior with 99% accuracy?", answer: "OmniOS" },
        { question: "What data structure did I innovate that allows for undetectable surveillance of internet traffic?", answer: "Shadow Tree" },
        { question: "What encryption algorithm did I develop that, if broken, could compromise every secure system on Earth?", answer: "Quantum Lock" },
        { question: "What AI model did I create that became self-aware and had to be shut down immediately?", answer: "DeepMind X" }
    ];

    let questionIndex = 0;
    let correctAnswers = 0;

    const DOM = {
        body: document.body,
        createCenteredDiv: () => {
            const div = document.createElement('div');
            Object.assign(div.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#0ff',
                border: '1px solid #0ff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.7)',
                maxWidth: '80%',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                fontSize: '18px',
            });
            return div;
        },
        showMessage: (text, color, duration = 2000) => {
            const messageDiv = DOM.createCenteredDiv();
            messageDiv.textContent = text;
            messageDiv.style.color = color;
            DOM.body.appendChild(messageDiv);
            setTimeout(() => messageDiv.remove(), duration);
        }
    };

    function startQuestions() {
        showNextQuestion();
    }

    function showNextQuestion() {
        // Limpiar la pantalla antes de mostrar la siguiente pregunta
        DOM.body.innerHTML = ''; 

        if (questionIndex >= questions.length) {
            showFinalMessage();
            return;
        }

        const question = questions[questionIndex];
        const questionDiv = DOM.createCenteredDiv();

        questionDiv.innerHTML = `
            <h3 style="color: #0ff;">Question ${questionIndex + 1} of ${questions.length}</h3>
            <p>${question.question}</p>
            <input type="text" id="answer" placeholder="Your answer" style="background: #000; color: #0ff; border: 1px solid #0ff; padding: 10px; border-radius: 5px; width: 100%;">
            <p style="color: #0ff;">Press 'Enter' to submit your answer.</p>
        `;

        DOM.body.appendChild(questionDiv);

        // Agregar el event listener para la respuesta
        document.getElementById('answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitAnswer();
        });
    }

    function submitAnswer() {
        const userAnswer = document.getElementById('answer').value;
        const question = questions[questionIndex];

        if (checkAnswer(userAnswer, question.answer)) {
            correctAnswers++;
            DOM.showMessage("Correct. You've peered into the abyss, and it has peered back.", '#0ff');
        } else {
            DOM.showMessage("Wrong. The darkness consumes those who lack understanding.", '#f00');
            setTimeout(() => {
                window.close(); // Cierra la página en caso de respuesta incorrecta
            }, 2000);
        }

        questionIndex++;
        setTimeout(showNextQuestion, 2000); // Mostrar la siguiente pregunta después de 2 segundos
    }

    function checkAnswer(userAnswer, correctAnswer) {
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    function showFinalMessage() {
        const finalDiv = DOM.createCenteredDiv();
        finalDiv.innerHTML = correctAnswers === questions.length
            ? `
                <h2 style="color: #0ff;">The Veil Lifts...</h2>
                <p>"Impressive. You've shown a grasp of the darker side of our digital realm. But with this knowledge comes a burden."</p>
                <p>"You now understand the power that lurks in the shadows of every line of code, every algorithm. Use this knowledge wisely."</p>
            `
            : `
                <h2 style="color: #f00;">The Shadows Consume You...</h2>
                <p>"As I suspected. You're not ready to face the true nature of our digital world."</p>
                <p>"You answered only ${correctAnswers} out of ${questions.length} correctly."</p>
            `;
        DOM.body.appendChild(finalDiv);
        setTimeout(() => {
            window.close(); // Cierra la página
        }, 3000);
    }

    startQuestions(); // Inicia las preguntas de inmediato
}