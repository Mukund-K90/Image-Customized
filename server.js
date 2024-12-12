const express = require('express');
const app = express();
const path = require('path');
const PORT = 1818;

app.set("view engine", 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));

app.get('/', (req, res) => {
    res.render("home")
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))