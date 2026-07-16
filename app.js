// =====================================
// HAXECRASH AI - ĐỆ THÀNH 🤖
// GROQ API
// =====================================


// ===== NHẬP API GROQ Ở ĐÂY =====

const API_KEY = "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";

const MODEL = "llama-3.3-70b-versatile";



// =====================================
// LẤY HTML
// =====================================

const chatBox = document.getElementById("chatBox");
const chatTabs = document.getElementById("chatTabs");

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const newChatBtn = document.getElementById("newChat");

const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");



let chats =
JSON.parse(localStorage.getItem("det_thanh_chat"))
|| {};

let currentChat = null;

let selectedImage = null;



// =====================================
// LƯU CHAT
// =====================================

function saveChat(){

    localStorage.setItem(
        "det_thanh_chat",
        JSON.stringify(chats)
    );

}




// =====================================
// TẠO CHAT MỚI
// =====================================

function createChat(){


    let id = Date.now();



    chats[id] = {

        name:"New Chat",

        messages:[

            {

                role:"assistant",

                text:
                "Chào bạn! 😊 Bạn cần giúp gì không?"

            }

        ]

    };



    currentChat=id;


    saveChat();

    renderTabs();

    loadChat();


}





// =====================================
// HIỆN TAB
// =====================================

function renderTabs(){


    chatTabs.innerHTML="";


    Object.keys(chats).forEach(id=>{


        let tab =
        document.createElement("div");



        tab.className="chat-tab";



        if(id==currentChat){

            tab.classList.add("active");

        }



        tab.innerHTML=`

        <span>${chats[id].name}</span>

        <span class="tab-menu">
        ...
        </span>

        `;



        tab.onclick=()=>{

            currentChat=id;

            renderTabs();

            loadChat();

        };



        tab.querySelector(".tab-menu")
        .onclick=(e)=>{

            e.stopPropagation();

            tabMenu(id);

        };



        chatTabs.appendChild(tab);


    });


}





// =====================================
// MENU TAB
// =====================================

function tabMenu(id){


    let choice =
    prompt(
`1 - ✏️ Đổi tên
2 - 🗑️ Xóa`
    );



    if(choice==="1"){


        let name =
        prompt("Tên mới:");



        if(name){

            chats[id].name=name;

            saveChat();

            renderTabs();

        }


    }



    if(choice==="2"){


        delete chats[id];


        saveChat();



        if(id==currentChat){

            currentChat=null;

            chatBox.innerHTML="";

        }



        renderTabs();

    }


}





// =====================================
// LOAD CHAT
// =====================================

function loadChat(){


    chatBox.innerHTML="";


    chats[currentChat]
    .messages
    .forEach(msg=>{


        addMessage(
            msg.text,
            msg.role,
            false
        );


    });


}






// =====================================
// HIỆN TIN NHẮN
// =====================================

function addMessage(text,role,save=true){


    let div =
    document.createElement("div");



    div.className =
    "message " +

    (
        role==="user"
        ?
        "user-message"
        :
        "ai-message"
    );



    div.innerText=text;



    chatBox.appendChild(div);



    chatBox.scrollTop =
    chatBox.scrollHeight;



    if(save){


        chats[currentChat]
        .messages.push({

            role:role,

            text:text

        });



        saveChat();

    }


}





// =====================================
// GỌI GROQ AI
// =====================================

async function askAI(message){



    let response =
    await fetch(

    "https://api.groq.com/openai/v1/chat/completions",

    {


        method:"POST",


        headers:{


            "Content-Type":
            "application/json",


            "Authorization":
            "Bearer " + API_KEY


        },


        body:JSON.stringify({


            model:MODEL,


            messages:[


                {

                    role:"system",

                    content:
                    "Bạn là Đệ Thành 🤖. Trả lời tiếng Việt, thân thiện, thông minh."

                },


                {

                    role:"user",

                    content:message

                }


            ]

        })


    });



    let data =
    await response.json();



    return data
    .choices[0]
    .message
    .content;


}





// =====================================
// GỬI TIN NHẮN
// =====================================

async function sendMessage(){


    let text =
    input.value.trim();



    if(!text)
    return;



    addMessage(
        text,
        "user"
    );



    input.value="";



    let loading =
    document.createElement("div");


    loading.className =
    "message ai-message typing";


    loading.innerText="...";


    chatBox.appendChild(loading);



    try{


        let answer =
        await askAI(text);



        loading.remove();



        addMessage(
            answer,
            "assistant"
        );


    }

    catch(error){


        loading.remove();



        addMessage(
        "❌ Lỗi API Groq. Kiểm tra API key!",
        "assistant"
        );


        console.log(error);


    }



}




sendBtn.onclick =
sendMessage;



input.addEventListener(
"keydown",
(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});






// =====================================
// CHỌN ẢNH
// =====================================

imageInput.onchange=(e)=>{


    let file =
    e.target.files[0];


    if(!file)
    return;



    selectedImage=file;



    let url =
    URL.createObjectURL(file);



    imagePreview.innerHTML=`

    <div class="preview">

        <img src="${url}">

        <button class="remove-image">
        ❌
        </button>

    </div>

    `;



    document
    .querySelector(".remove-image")
    .onclick=()=>{


        selectedImage=null;

        imagePreview.innerHTML="";

        imageInput.value="";


    };


};






// =====================================
// CHAT MỚI
// =====================================

newChatBtn.onclick=()=>{


    let ok =
    confirm(
    "Bạn có muốn tạo cuộc trò chuyện mới không?"
    );



    if(ok){

        createChat();

    }

};






// =====================================
// KHỞI ĐỘNG
// =====================================

if(Object.keys(chats).length===0){

    createChat();

}

else{


    currentChat =
    Object.keys(chats)[0];


    renderTabs();

    loadChat();

}
