const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = ""; //API KEY OpenAI
const inputInitHeight = chatInput.scrollHeight;


const createChatLi = (message, className) => {

    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message; //para evitar si es alguien agrega codigo el mensaje tome esas caracteristicas
    return chatLi;
}

//AQUI SE REALIZA LA CREACION DE CAHT CON OPENAI
const generateResponse = (incomingChatLi) => {
    const API_URL= "https://api.openai.com/v1/chat/completions"; //Chat Completions
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            
    messages:[
        {"role": "system", "content": "Tu eres un asistente de Venta de la Tienda Delta Tactical Gear, en donde se ofrece productos militares y esas cosas, ya le das mas contexto tu, po si te preguntan se ofrece productos por categorias, las mas vistosas son los chalecos y las mochilas, por el contacto hacia la empresa ofreceras de un correo que tu inventes no es necesario que exista, responderas de manera corta, no quiero respuestas largas, y tambien si es que te reguntan sobre los integrantes de grupo, son De la Cruz Sayago Ian Zahir y Romo Turco Jorge Andres"},
        {"role": "user", "content": `${userMessage}`},
    ]
        })

        
    }
    //AQUI SE ENVIA POR METODO POST SIENDO RESPONDIDO GET
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        //console.log(data);
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) =>{
        messageElement.classList.add("error");
        messageElement.textContent = "oh no...surgio un error. Intentalo de nuevo";
        //console.log(error);
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));

}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(()=>{
        const incomingChatLi = createChatLi("Escribiendo...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    //ajusta la altura del area del texto de entrada segun el contenido
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"));
