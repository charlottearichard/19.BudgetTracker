const request = indexedDB.open("budget-tracker", 1)

let db; 

request.onupgradeneeded = (event) => {
    db = event.target.result
    db.createObjectStore('transactions', {autoIncrement: true})
}

request.onsuccess = (event) =>{
    db = event.target.result
}

request.onerror = (event) => {
    console.log(event.target.errorCode)
}

function saveRecord(money) {
    const transaction = db.transaction('transactions', 'readWrite')
    const transactionStore = transaction.objectStore('transactions')
    transactionStore.add(money)
} 

//add to the mongo database 
const addMongo = () => {
    const transaction = db.transaction('transactions', 'readWrite')
    const transactionStore = transaction.objectStore('transactions')
    const getTransactions = transactionStore.getAll()

    getTransactions.onsuccess = () => {
        if (getTransactions.result.length){
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getTransactions.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
              })
              .then(response => {    
                return response.json();
              })
              .then(data => {
                if (data.message) {
                  console.log(data)
                    return
                } 
                const transaction = db.transaction('transactions', 'readWrite')
                const transactionStore = transaction.objectStore('transactions')
                transactionStore.clear()
                alert("Added to database!")
              })
              .catch(err => {
                console.log(err)
              });
        }
    }
}


window.addEventListener("online", addMongo)