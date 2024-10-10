//Select DOM Elements

const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');

//Error Message Elements
const nameError = document.getElementById('nameError');
const idError = document.getElementById('idError');
const emailError = document.getElementById('emailError');
const contactError = document.getElementById('contactError');

//Add button
const  addButton = document.getElementById('addBttn');

// Retrieve students from localStorage or initialize empty array
let students = JSON.parse(localStorage.getItem('students')) || [];

let editIndex = null;

function renderTable(){
    studentTableBody.innerHTML = '';

    students.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.classList.add('border-t');

        tr.innerHTML = `
            <td class="p-3">${student.name}</td>
            <td class="p-3">${student.id}</td>
            <td class="p-3">${student.email}</td>
            <td class="p-3">${student.contact}</td>
            <td class="p-3">
                <button class="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 edit-btn" data-index="${index}">Edit</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2 delete-btn" data-index="${index}">Delete</button>
            </td>
        `;

        studentTableBody.appendChild(tr);
        
    });
    
}

// save to local storage
function saveToLocalStorage(){
    localStorage.setItem('students', JSON.stringify(students));
    
}

// Function to validate input field
function validateInputs(name, id, email, contact){
    let isValid = true;
    //check valid name
    const nameRegex = /^[A-Za-z\s]+$/;
    if(!nameRegex.test(name)){
        nameError.classList.remove('hidden');
        isValid = false;
    } else {
        nameError.classList.add('hidden')
    }

    //check student id is numeric or not
    const idRegex = /^\d+$/;
    if(!idRegex.test(id)){
        idError.classList.remove('hidden');
        isValid = false;
    } else{
        idError.classList.add('hidden');
    }

    //check email address is valid or not
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        emailError.classList.remove('hidden');
        isValid = false;
    } else{
        emailError.classList.add('hidden');
    }

    //check contact number is valid or not
    const contactRegex = /^\d{10}$/;
    if(!contactRegex.test(contact)){
        contactError.classList.remove('hidden')
        isValid = false;
    } else{
        contactError.classList.add('hidden')
    }

    return isValid;
}




// Function to Reset form
function resetForm(){
    studentForm.reset();
    //hide all error messages
    nameError.classList.add('hidden');
    idError.classList.add('hidden');
    emailError.classList.add('hidden');
    contactError.classList.add('hidden');

    editIndex = null;
    // Change update button to Add
    
    addButton.textContent = 'Add';
    addButton.classList.remove('bg-green-500','hover:bg-green-600');
    addButton.classList.add('bg-blue-500','hover:bg-blue-600');
    
}


// Event Listener for form submission
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const id = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contactNo').value.trim();

    if(!validateInputs(name, id, email, contact)){
        return;
    }

    if(editIndex===null){
        // Create student object
        const student = { name, id, email, contact};

        // Add student to array
        students.push(student);

    } else {
        students[editIndex] = {name, id, email, contact };
    }
    
    
    // Save to localStorage
    saveToLocalStorage();

    // Render table
    renderTable();

    // Reset form
    resetForm();

});

// Event Delegation for Edit and Delete Buttons
studentTableBody.addEventListener('click',(e) => {
    if(e.target.classList.contains('edit-btn')){
        const index = e.target.getAttribute('data-index');
        editStudent(index);
    }

    if(e.target.classList.contains('delete-btn')){
        const index = e.target.getAttribute('data-index');
        deleteStudent(index);
    }
});

function editStudent(index){
    const student = students[index];
    if(student){
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentId').value = student.id;
        document.getElementById('email').value = student.email;
        document.getElementById('contactNo').value = student.contact;

        editIndex =  index;

        // Change Add button to Update
       
        addButton.textContent = 'Update';
        addButton.classList.remove('bg-blue-500','hover:bg-blue-600');
        addButton.classList.add('bg-green-500','hover:bg-green-600');

        

    }
}

function deleteStudent(index){
    if(confirm('Are you sure you want to delete this record?')){
        students.splice(index,1);
        saveToLocalStorage();
        renderTable();

        if(editIndex===index){
            resetForm();
        }
    }
}


renderTable();
