/* -- Form --*/
const Formulario = (() =>{
    const formState = {
        user: "",
    }

    return {
        getUsername(){
            return formState.user;
        },
        setUsername(nickname){
            formState.user = nickname;
        }
    }
})();

/* -- Storage --*/
const Storage = (() =>{

    return{
        getStorage(){
           const notes = JSON.parse(localStorage.getItem('notes')) ?? []
           return notes
        },
        storeNote(note, notesArray){
            notesArray.unshift(note)
            localStorage.setItem('notes', JSON.stringify(notesArray))
            return notesArray
        },
        setNotes(notes){
            localStorage.setItem('notes', JSON.stringify(notes))
        },
        saveUsername(username){
            localStorage.setItem('username', JSON.stringify(username))
        },
        getUsername(){
            const username =  JSON.parse(localStorage.getItem('username')) ?? [];
            return username;
        }

    }
})();

/* -- UI --*/
const UICtrl = (()=>{
    const UISelectors = {
        mainApp: 'sticky-notes',
        notesContainer: 'notes-container',
        noteTitle: 'note-title',
        noteText: 'note-text',
        addNewNoteBtn: 'add-note',
        editNoteBtn : 'edit-btn',
        saveNoteBtn : 'save-btn',
        deleteNoteBtn: 'delete-btn',
        // noteText: '.notes-paragraph',
        notesDiv: '.sticky-notes-card',
        colors: '.sticky-color',
        selected: 'selected',
        form: 'formulario',
        formDiv: 'form',
        usernameDiv: 'sticky-username',

    }

    return {
        animate(event){
            let target;
            if(event.target.classList.contains('add-note')){
                target = event.target
                target.classList.add('animate')
            } else {
                target = event.target.parentElement
                target.classList.add('animate')
            }

            setTimeout(() =>{
                target.classList.remove('animate')
            }, 1000)
        },

        setUsernameTitle(username){
            document.getElementById(UISelectors.usernameDiv).innerText = username; 
        },
         populateNotesList(notes){
            let htmlList = "";
            
            notes.forEach((note) => {
                const {id, title, text, color} = note;
            htmlList +=  `
                <div class="sticky-notes-card" id="${id}" style="background-color: ${color}">
                    <div class="notes-title"> 
                        <textarea id="note-title" disabled>${title == "" ? "Note title.." : title}</textarea>
                    </div>
                    <div class="notes-paragraph">
                    <textarea id="note-text" disabled> ${text == "" ? "Note text.." : text}</textarea>                  
                    </div>
                    <button class="edit-card" id="edit-btn">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="save-card" id="save-btn">
                        save
                    </button>
                    <button class="delete-card" id="delete-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
        `
      });
            document.getElementById(UISelectors.notesContainer).innerHTML = htmlList
         }
        ,
        selectColor(event,colorSelected,{noteColor}){
            if(noteColor != colorSelected){
                const prev = document.querySelector(`[data-color='${noteColor}']`)
                if(prev?.classList.contains('selected')){
                    prev.classList.remove('selected')
                }
                event.target.classList.add('selected')
            }
            
        },
        addNewNote(note){
            const {id, title, text, color} = note;
            if(color == ''){
                Toastify({
                    text: "❗Selecione uma cor❗",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: false,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "#333",
                      color: '#fff',
                      borderRadius: '20px',
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                return;
            }
            const container = document.getElementById(UISelectors.notesContainer)
            const div = document.createElement('div');
            div.classList.add('sticky-notes-card')
            div.id = id;
            div.style.backgroundColor = color;
            div.innerHTML = `
                <div class="notes-title"> 
                    <textarea id="note-title" placeholder='${title}' disabled></textarea>
                </div>
                <div class="notes-paragraph">
                  <textarea id="note-text" placeholder='${text}' disabled></textarea>                  
                </div>
                <button class="edit-card" id="edit-btn">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="save-card" id="save-btn">
                  save
                </button>
                <button class="delete-card" id="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `
            
            container.prepend(div)
            return note;
        },

        deleteNote(noteId){
            const noteToDelete = document.getElementById(noteId)
            console.log(noteToDelete)
            noteToDelete.remove();
        },

        isAble(noteId){
            const div = document.getElementById(noteId);
            const titleDiv = [...div.children[0].children][0];
            const textDiv = [...div.children[1].children][0];
            const saveBtn = [div.children[3]][0];
            const deleteBtn = [div.children[4]][0];
            titleDiv.disabled = false;
            textDiv.disabled = false;
            saveBtn.classList.remove('notActive')
            deleteBtn.classList.remove('notActive')
            saveBtn.classList.add('active')
            deleteBtn.classList.add('active')
        },

        isNotAble(noteId){
            const div = document.getElementById(noteId);
            const titleDiv = [...div.children[0].children][0];
            const textDiv = [...div.children[1].children][0];
            const saveBtn = [div.children[3]][0];
            const deleteBtn = [div.children[4]][0];
            titleDiv.disabled = true;
            textDiv.disabled = true;
            saveBtn.classList.remove('active')
            deleteBtn.classList.remove('active')
            saveBtn.classList.add('notActive')
            deleteBtn.classList.add('notActive')
        },

        getSelectors(){
            return UISelectors;
        },

        resetColor(color){
            const colorSelected = document.querySelector(`[data-color='${color}']`)
            colorSelected?.classList.remove('selected')
        },

        hideForm(){
            document.getElementById(UISelectors.formDiv).classList.add("hide");
        },

        showNotesContainer(){
            document.getElementById(UISelectors.mainApp).classList.remove("hide");
        }
    }
})();

/* -- New Notes --*/
const NotesCtrl = (() =>{

    const Note = function(args){
        const {id, title, text, color} = args;
        this.id = id;
        this.title = title;
        this.text = text;
        this.color = color;
    }

    const state = {
        notes: Storage.getStorage(),
        currentNote: null,
    }

    return {
        newNote(notesDetails){
            return new Note(notesDetails)
        },

        updateNotesArray(newState){
            state.notes = newState;
        }, 
        getNotes(){
            return state.notes;
        },
        getCurrentNote(noteId){
             const currentNote = state.notes.find(note => note.id === noteId);
             return currentNote;
        },
        getState(){
            return state;
        },
        editCurrent(currentNote){
            state.currentNote = currentNote;
            const currentId = parseInt(currentNote.id)
            const found = state.notes.find(note => note.id === currentId)
            if(state.currentNote.title !== ""){
                found.title = state.currentNote.title
            }
            if(state.currentNote.text !== ""){
                found.text = state.currentNote.text
            }
          const noteIndex = state.notes.map(note => note.id).indexOf(currentId)
          
          state.notes.splice(noteIndex, 1, found)
          return state.notes
        },
        deleteCurrent(currentNoteID){
            const currentId = parseInt(currentNoteID)
            const found = state.notes.find(note => note.id === currentId)
            if(found){
                const noteIndex = state.notes.map(note => note.id).indexOf(currentId)
                state.notes.splice(noteIndex, 1)
                return state.notes
            }
        }

    }
})();

/* -- App --*/
const App = ((Formulario,NotesCtrl, UICtrl, Storage)=>{

    const UISelectors = UICtrl.getSelectors();
    
    const state = {
        noteColor: '',
        noteSelected:{}
    }
    
    const loadEvents = () =>{
        
        document.querySelectorAll(UISelectors.colors)
        .forEach(colorBtn=> colorBtn.addEventListener('click', getColor))

        document
        .getElementById(UISelectors.addNewNoteBtn)
        .addEventListener('click', submitNote)

        document.querySelectorAll("#"+UISelectors.editNoteBtn).forEach(btn =>{
            btn.addEventListener('click', editNote)
        })

        document.querySelectorAll("#"+UISelectors.saveNoteBtn).forEach(btn =>{
            btn.addEventListener('click', saveEditedNote)
        })

        document.querySelectorAll("#"+UISelectors.deleteNoteBtn).forEach(btn =>{
            btn.addEventListener('click', deleteNote)
        })

        document.querySelectorAll("#"+UISelectors.noteTitle).forEach(note =>{
            note.addEventListener('keyup', getDetails)
        })

        document.querySelectorAll("#"+UISelectors.noteText).forEach(note =>{
            note.addEventListener('keyup', getDetails)
        })

        document.getElementById(UISelectors.form).addEventListener("submit", login)
      
    }

    const showNotesAndUsername = (username) => {
        UICtrl.hideForm();
        UICtrl.showNotesContainer();
        UICtrl.setUsernameTitle(username);
    }

    const login =(e) =>{
        e.preventDefault();
        const userName = e.target.children[0].value
        Formulario.setUsername(userName)
        const savedUsername = Formulario.getUsername()
        Storage.saveUsername(savedUsername);
        UICtrl.hideForm();
        UICtrl.setUsernameTitle(savedUsername)
        UICtrl.showNotesContainer();
        
    }

    const getColor = (e) => {
        const colorSelectedByUser = e.target.dataset.color
        UICtrl.selectColor(e, colorSelectedByUser, state)
        state.noteColor = colorSelectedByUser
    }
    const addEventsAtSubmit = () =>{
        // document.querySelector(UISelectors.notesDiv).addEventListener('click', editNote)
        document.getElementById(UISelectors.editNoteBtn).addEventListener('click', editNote)
        document.getElementById(UISelectors.saveNoteBtn).addEventListener('click', saveEditedNote)
        document.getElementById(UISelectors.deleteNoteBtn).addEventListener('click', deleteNote)
        document.getElementById(UISelectors.noteTitle).addEventListener('keyup', getDetails)
        document.getElementById(UISelectors.noteText).addEventListener('keyup', getDetails)
    }

    const submitNote = (e) =>{
        let noteId = Math.floor(Math.random() * Date.now()); 
        const newNote = NotesCtrl.newNote({
            id: noteId,
            title: "Título..",
            text: "Clique no icone abaixo para editar ou excluir a sua notinha 😊!",
            color: state.noteColor,
        })
        UICtrl.animate(e);
        const noteToBeStored = UICtrl.addNewNote(newNote);
        if(!noteToBeStored){
            return;
        } 

        addEventsAtSubmit();

        //Storing
        const newState = Storage.storeNote(newNote, NotesCtrl.getNotes());
        NotesCtrl.updateNotesArray(newState);
        NotesCtrl.getNotes();
        

        //Reseting State and UI
        UICtrl.resetColor(state.noteColor);
        
        state.noteColor = '';
    }
    
    const getDetails = (e) =>{
        // const noteDivId = e.currentTarget.parentElement.parentElement.id;
        const { noteSelected } = state;
        // noteSelected.id = parseInt(noteDivId);

        if(e.target.id === "note-text"){
            noteSelected.text = e.target.value;
        } 

        if(e.target.id === "note-title"){
            noteSelected.title = e.target.value;
        } 
        
        
    }
    const editNote = (e) =>{
        const noteDivId = parseInt(e.currentTarget.parentElement.id);
        state.noteSelected = NotesCtrl.getCurrentNote(noteDivId)
        UICtrl.isAble(noteDivId);
    }

    const saveEditedNote =(e)=>{
        const { noteSelected } = state
        const noteDivId = e.currentTarget.parentElement.id;
        const noteEditedAddedOnArray = NotesCtrl.editCurrent(noteSelected)
        const newNoteArrayAfterUpdate = NotesCtrl.getNotes(noteEditedAddedOnArray);
        Storage.setNotes(newNoteArrayAfterUpdate)
        UICtrl.isNotAble(noteDivId);
    }

    const deleteNote = (e) =>{
        const confirmation = confirm("WARNING!\nAre you sure you want to delete this note?");
        if(confirmation){
        const noteDivId = e.currentTarget.parentElement.id;
        const noteToDeleteOnArray = NotesCtrl.deleteCurrent(noteDivId)
        const newNoteArrayAfterUpdate = NotesCtrl.getNotes(noteToDeleteOnArray);
        Storage.setNotes(newNoteArrayAfterUpdate)
        UICtrl.deleteNote(noteDivId)
        }
        
    }
  
    return {
        async init(){
            console.log("%c🤖 CoderHouse Project by\nLuis Pellizzon & Lucas Souza", "color:green;font-style:italic;")

            //CHECK IF USER EXIST
            const user = Storage.getUsername();
            if(user != ""){
                showNotesAndUsername(user)
            }
            
            //CHECK IF USER NOTES EXIST
            const notes = NotesCtrl.getNotes();
            if(notes.length > 0){
                UICtrl.populateNotesList(notes);
            }

            loadEvents();
            
        },
        
    }
})(Formulario,NotesCtrl, UICtrl, Storage);


App.init();