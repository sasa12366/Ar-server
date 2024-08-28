require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const unzipper = require('unzipper'); // нужен модуль для распаковки zip файлов
const bodyParser = require('body-parser');
const config = require("../config/express.config");
const server = http.createServer(app);
const { routeInit } = require("./presentation-layer/routes");

app.use(express.static('public'));
routeInit(app, express);

// Parse JSON requests
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());
const upload = multer(); // Используем multer для обработки multipart/form-data
// Handle POST request to create a package
app.post('/create-package', upload.single('zipFile'), async (req, res) => {
    try {
        if (!fs.existsSync('public/packages')) {
            fs.mkdirSync('public/packages', { recursive: true });
        }

        // Создание имени папки на основе текущей даты и времени
        const folderName = `package_${new Date().toISOString().replace(/[:.]/g, '-')}`;
        const folderPath = path.join('public', 'packages', folderName);

        fs.mkdirSync(folderPath);

        // Используем unzipper для распаковки архива из буфера
        await unzipper.Open.buffer(req.file.buffer)
            .then(d => d.extract({ path: folderPath }))
            .catch(err => {
                throw new Error('Failed to extract zip file: ' + err.message);
            });

        // Формируем URL для доступа к распакованному пакету
        const packageUrl = `/packages/${folderName}`;

        res.send({ folderName, packageUrl });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Failed to create package');
    }
});
// Маршрут для /dashboard
app.get('/dashboard', (req, res) => {
    // Указываем путь к файлу dashboard.html
    const dashboardPath = path.join(__dirname, 'public', 'dashboard.html');
    res.sendFile(dashboardPath);
});
// Start the server
server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}.`);
});
