const { createStore } = window.Redux

initialState = JSON.parse(localStorage.getItem('hobby_list')) || [];
const hobbyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_HOBBY': {
            const newList = [...state];
            newList.push(action.payload);

            return newList;
        }
        case 'DELETE_HOBBY': {
            console.log('@', action.payload)
            const newList = state.filter((e, index) => index.toString() !== action.payload)
            console.log('$', newList)
            return newList;
        }
        default:
            return state;
    }
}

const store = createStore(hobbyReducer);


// Bind function

const bindToNode = (node, name, fn) => {
    node[name] = fn.bind(node);
}

// Delete by id

const deleteById = (e) => {
    console.log('#', e.target.id)
    const deleteAction = {
        type: 'DELETE_HOBBY',
        payload: e.target.id
    };

    store.dispatch(deleteAction);
    hobbyFormElement.reset();
}

// Render hobby list

const renderHobbyList = (hobbyList) => {
    // if (!Array.isArray(hobbyList) || hobbyList.length === 0) return;

    const ulElemet = document.querySelector('#hobbyListId')
    if (!ulElemet) return;

    ulElemet.innerHTML = '';

    for (let i = 0; i < hobbyList.length; i++) {
        const liElement = document.createElement('li');
        liElement.className = 'hobby-list'
        liElement.textContent = hobbyList[i];
        const buttonElement = document.createElement('button')
        const iconElement = document.createElement('i');
        iconElement.className = 'fa-regular fa-circle-xmark'
        iconElement.id = i
        iconElement.addEventListener("click", function (e) { deleteById.call(this, e) }, false)
        buttonElement.appendChild(iconElement);
        liElement.appendChild(buttonElement);
        ulElemet.appendChild(liElement);
    }

}

//render inital hobby list
const initialHobbyList = store.getState();
renderHobbyList(initialHobbyList)

// handle form submit
const hobbyFormElement = document.querySelector('#hobbyFormId')
if (hobbyFormElement) {
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const hobbyInputElement = hobbyFormElement.querySelector('#hobbyInputId')
        if (!hobbyInputElement) return;

        console.log('SUBMIT', hobbyInputElement.value)
        const addAction = {
            type: 'ADD_HOBBY',
            payload: hobbyInputElement.value
        };
        store.dispatch(addAction);
        hobbyFormElement.reset();
    }
    const handleFormDelete = (id) => {
        if (!hobbyInputElement) return;
        console.log('DELETE', initialHobbyList.id)

        const deleteAction = {
            type: 'DELETE_HOBBY',
            payload: initialHobbyList.id
        };

        store.dispatch(deleteAction);
    }
    hobbyFormElement.addEventListener('submit', handleFormSubmit)
}

store.subscribe(() => {
    console.log('STATE UPDATE :', store.getState())
    const newHobbyList = store.getState();
    renderHobbyList(newHobbyList)
    localStorage.setItem('hobby_list', JSON.stringify(newHobbyList))
});
