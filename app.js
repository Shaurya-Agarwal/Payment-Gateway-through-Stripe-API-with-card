const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
const app = express() 

var Publishable_Key = 'pk_test_51I59TAI7CjXdtsSLgQ0RgiKBOuTQE2nH5Xu1BGX29mYijPpjIZRcadaztKsKzhsPjcRZKXutPIYXxmPJGimDItwg00nhGSNqmF'
var Secret_Key = 'sk_test_51I59TAI7CjXdtsSL6YRRPnABS8OjkgDZbqhX3vIfLdV2zWAyb8FDK9vffGlfzMoyNdK0zAW4HFeGiRN4ktFckt3P002NBEbpXd'


const stripe = require('stripe')(Secret_Key) 

const port = process.env.PORT || 3000 

app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 

app.get('/', function(req, res){ 
    res.render('home', { 
    key: Publishable_Key 
    }) 
}) 

app.post('/payment', function(req, res){ 

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'shaurya agarwal',
		address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '110092', 
            city: 'New Delhi', 
            state: 'Delhi', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 

        return stripe.charges.create({ 
            amount: 7000,    // Charing Rs 25 
            description: 'Web Development Product', 
            currency: 'INR', 
            customer: customer.id
        }); 
    }) 
    .then((charge) => { 
        res.send("Success") // If no error occurs 
    }) 
    .catch((err) => { 
        console.log(err)
		res.send(err)    // If some error occurs 
    }); 
});

app.get('/cancel', (req, res) => res.send('Cancelled'));



app.listen(port, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully") 
})