const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')

mongoose.connect('mongodb://localhost:27017/crud-v2')
    .then(() => {
        console.log('The Database connection is successful!')
    })
    .catch(() => {
        console.log(err);
    })

const crudV2Schema = new mongoose.Schema({
    name: String,
    skill: String,
    department: String
});
const CrudV2 = mongoose.model('CrudV2', crudV2Schema);

const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//show all records
app.get('/', (req, res) => {
    CrudV2.find({}, (err, result) => {
        if (!err) {
            res.render('index', { title: 'CRUD Application', records: result })
        } else {
            console.log(err)
        }
    })

})

//show a single reord
.get('/show/:id', (req, res) => {
        //const { _id } = req.params.id
        CrudV2.findById({ _id: req.params.id }, (err, result) => {
            if (!err) {
                res.render('show', { title: 'Single record detail', record: result })
            } else {
                console.log(err)
            }
        })
    })
    //display the create form
    .get('/create', (req, res) => {
        res.render('create', { title: 'Create Record Page' })
    })

//create a new record
.post('/create', (req, res) => {
    const newRecord = new CrudV2(req.body);
    newRecord.save(err => {
        if (!err) {
            res.redirect('/')
        } else {
            console.log(err)
        }
    })
})

//edit route
.get('/edit/:id', (req, res) => {
    CrudV2.findById({ _id: req.params.id }, (err, result) => {
        if (!err) {
            res.render('edit', { title: 'Edit Recod Page', record: result })
        } else {
            console.log(err)
        }
    })
})

//Update record route
.post('/update/:id', (req, res) => {
    CrudV2.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            skill: req.body.skill,
            department: req.body.department
        }
    }, { new: true }, (err, result) => {
        if (!err) {
            res.redirect('/')
        } else {
            console.log(err)
        }
    })
})

//delete route
.post('/delete/:id', (req, res) => {
    CrudV2.findByIdAndRemove({ _id: req.params.id }, (err, result) => {
        if (!err) {
            console.log('Record deleted successfuly!')
            res.redirect('/')
        } else {
            console.log(err)
        }
    })
})
app.listen(3000, () => {
    console.log('The server started on port 3000');
})