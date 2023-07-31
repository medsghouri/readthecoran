import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://read-the-quran-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
var khatmaNoEl = document.getElementById("khatmaNo").value

var khatmaPathInDB = "khatma/" + "431" +"/user"
const khatmaInDB = ref(database, khatmaPathInDB)

const userTableEl = document.getElementById("userTable")
var userTbodyEl = document.getElementById('userTbody');

var ARRAY ;
// ---------------------------------------------------------------------------------------------
//      Functions
// ---------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------
//      PBO
// ---------------------------------------------------------------------------------------------
// --- get all values from DB, Whenever any change occures in DB -------------------------------
onValue(khatmaInDB, function(snapshot) {
    let userArray = Object.values(snapshot.val())   // Change JSON format to Array format
    ARRAY = Object.values(snapshot.val()) 
    clearUserTableEl()
    for (let i = 0; i < userArray.length; i++) {
        let currentUser = userArray[i]
        addUserToTableEl(currentUser)
        
        // PBO For each Row
        pboForEachRow(currentUser)
        
        // Filter users when searching
        onFilter()
        // onFilterStatus()
    }
    


})

//--


//--

// --- Clear user table ------------------------------------------------------------------------
function clearUserTableEl() {
    userTbodyEl.innerHTML = ""
}

// --- Add User infos and Row to Table ---------------------------------------------------------
function addUserToTableEl(userValue) {

    // var td1 = document.createElement('td');
    // td1.innerHTML = userValue.status;
    // td1.id="td1"+userValue.no
    // trow.appendChild(td1);
    
    var trowEl = document.createElement('tr');
    var tdRowEl = document.createElement('td');
    
    var iLeftEl = document.createElement('i')
    var divRightEl = document.createElement('div')
    
    // tdNameEl.innerHTML = userValue.name;
    tdRowEl.id="tdRow"+userValue.no
    
    iLeftEl.id="iLeft"+userValue.no
    divRightEl.innerHTML = ` الحزب ` + userValue.no+ ` - ` + userValue.name  ;
    divRightEl.style.cssFloat = "right"
    
    tdRowEl.appendChild(iLeftEl)
    tdRowEl.appendChild(divRightEl)
    trowEl.appendChild(tdRowEl); 
    userTbodyEl.appendChild(trowEl);
    
        
    //--------------------- Click on Name in Table --------------
    tdRowEl.addEventListener("click", function() {
        updateStatusInDB(userValue)
    })
}

// --- Change Color of each Row ----------------------------------------------------------------
function pboForEachRow(currentUser){
    
    var iLeftEl = document.getElementById("iLeft"+currentUser.no)
    
    iLeftEl.style.cssFloat = "left"
    
    if (currentUser.status == 'X'){ // Green
        // -- Change color of row --
        document.getElementById("tdRow"+currentUser.no).style.backgroundColor = '#c7e5c9' //Lightgreen
        document.getElementById("tdRow"+currentUser.no).style.borderColor = '#224823' //Darkgreen
        
        // -- change icon of row
        iLeftEl.className = "fa fa-check"
        iLeftEl.style.fontSize = "30px"
        iLeftEl.style.color = '#224823'
        
    }
    else{ // Red
        // -- Change color of row --
        document.getElementById("tdRow"+currentUser.no).style.backgroundColor = 'lightred' 
        document.getElementById("tdRow"+currentUser.no).style.borderColor = '#73000c' //Darkgreen
        
        // -- change icon of row
        iLeftEl.className = "fa fa-times"
        iLeftEl.style.fontSize = "30px"
        iLeftEl.style.color = '#73000c'
    }
       
}





// ---------------------------------------------------------------------------------------------
//      PAI
// ---------------------------------------------------------------------------------------------
// --- Udate Status in DB ----------------------------------------------------------------------
function updateStatusInDB(userValue){
    
    // Popup to confirm
    let text = " تأكيد قراءة الحزب " ;
    if (confirm(text) == true) {
        text = "You pressed OK!";
        // Update Status in DB
        var userInDB = "khatma/"+431+"/user/" + userValue.no    
        var userRef = ref(database,userInDB);
      
        if (userValue.status == ''){
            update(userRef, {'status': 'X'}) 
        }
        else {
            update(userRef, {'status': ''})     
        } 
        } else {
            text = "You canceled!";
        }

}


// --- on Searching ----------------------------------------------------------------------------
var searchEl = document.getElementById("search");
searchEl.addEventListener("keyup", function() {
    onFilter()
})




// --- on Searching ----------------------------------------------------------------------------
var statusEl = document.getElementById("status");
statusEl.addEventListener("change", function() {
    onFilter()
})


// --- Filter users based on the search --------------------------------------------------------
function onFilter(){
    var filter, table, tr, td, i, txtValue;
    filter = searchEl.value.toUpperCase();
    table = document.getElementById("userTable");
        
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        
                // --
            if (statusEl.value == "true"){
                if (ARRAY[i].status == 'X') {   
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
            
            if (statusEl.value == "false"){
                if (ARRAY[i].status == '') {   
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }     
            
            if (statusEl.value == ""){
                tr[i].style.display = "";
            }        
            // --
        
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }  
        

    }
}

// --- Filter users based on the search --------------------------------------------------------
function onFilterStatus(){
    var filter, table, tr, td, i, txtValue;
    if (statusEl == "true"){
        filter = "X"
    } else{
        filter = ""
    }
    table = document.getElementById("userTable");
        
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        // td = tr[i].getElementsByTagName("td")[0];
        // if (td) {
            // txtValue = td.textContent || td.innerText;
    
            // console.log(tr[i])
            // console.log(ARRAY[i].status)
            // console.log(statusEl.value)
            if (statusEl.value == "true"){
                if (ARRAY[i].status == 'X') {   
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
            
            if (statusEl.value == "false"){
                if (ARRAY[i].status == '') {   
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }     
            
            if (statusEl.value == ""){
                tr[i].style.display = "";
            }          
        // }       
    }
}