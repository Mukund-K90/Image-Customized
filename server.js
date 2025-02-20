const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 1818;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const dotenv = require('dotenv');
dotenv.config();
const key = process.env.RBG_KEY || "6Lu6WfjPB2PVE7rw3tu3JaR2";
const nodemailer = require('nodemailer');

app.set("view engine", 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.render("home")
})
app.use(bodyParser.json({ limit: "10mb" }));

async function removeBg(imageBlob, backgroundUrl) {

    const formData = new URLSearchParams();
    formData.append("size", "auto");
    formData.append("image_file_b64", imageBlob);
    formData.append("bg_image_url", backgroundUrl)

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": key },
        body: formData,
    });

    if (response.ok) {
        return await response.arrayBuffer();
    } else {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${response.statusText} - ${errorText}`);
    }
}

//change bg 
app.post('/change-bg', async (req, res) => {
    try {
        const { imageBlob, backgroundUrl } = req.body;

        if (!imageBlob) {
            throw new Error('No image blob provided');
        }

        const rbgResultData = await removeBg(imageBlob, backgroundUrl);

        res.send({
            success: true,
            rbgResultData: Buffer.from(rbgResultData),
        });
    } catch (error) {
        console.error('Error in /change-bg:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

//send email
app.post('/send-email', upload.single('image'), async (req, res) => {
    try {
        const imageDetails = JSON.parse(req.body.details);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:  process.env.EMAIL,
                pass:  process.env.PASSWORD
            }
        });
        const mailOptions = {
            to: 'koladiyamukund58@gmail.com',
            subject: 'OMGS Acrylic Photo',
            text: `image details:\n\n${JSON.stringify(imageDetails, null, 2)}`,
            attachments: [{
                filename: req.file.originalname,
                content: req.file.buffer
            }]
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'File Shared Successully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))