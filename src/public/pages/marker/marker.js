const { MarkerModule, Package } = ARjsStudioBackend;

var githubButton = document.querySelector('page-footer').shadowRoot.querySelector('#github-publish');
var zipButton = document.querySelector('page-footer').shadowRoot.querySelector('#zip-publish');

window.assetParam = {
    scale: 1.0,
    size: {
        width: 1.0,
        height: 1.0,
        depth: 1.0,
    },
};

/**
 * Initialize the default marker image on page load.
 */
const setDefaultMarker = () => {
    const c = document.createElement('canvas');
    const img = document.querySelector('.default-marker-hidden');
    c.height = img.naturalHeight;
    c.width = img.naturalWidth;
    const ctx = c.getContext('2d');

    ctx.drawImage(img, 0, 0, c.width, c.height);
    const base64String = c.toDataURL();
    window.markerImage = base64String;

    MarkerModule.getFullMarkerImage(base64String, 0.5, 512, "black")
        .then((fullMarkerImage) => {
            window.fullMarkerImage = fullMarkerImage;
            img.remove();
        });
}

const checkUserUploadStatus = () => {
    enablePageFooter(window.markerImage && window.assetFile);
}

// All the required components are uploaded by the user => footer will be enable
const enablePageFooter = (enable) => {
    if (enable) {
        githubButton.classList.remove('publish-disabled');
        zipButton.classList.remove('publish-disabled');
        githubButton.removeAttribute('disabled');
        zipButton.removeAttribute('disabled');
    } else {
        githubButton.classList.add('publish-disabled');
        zipButton.classList.add('publish-disabled');
        githubButton.setAttribute('disabled', '');
        zipButton.setAttribute('disabled', '');
    }
}


const zip = () => {
    // TODO: replace alerts with HTML error messages.
    if (!window.markerImage) return alert('please select a marker image');
    if (!window.assetType) return alert('please select the correct content type');
    if (!window.assetFile || !window.assetName) return alert('please upload a content');

    MarkerModule.getMarkerPattern(window.markerImage)
        .then((markerPattern) => (new Package({
            arType: 'pattern',
            assetType: window.assetType, // image/audio/video/3d
            assetFile: window.assetFile,
            assetName: window.assetName,
            assetParam: window.assetParam,
            markerPatt: markerPattern
        })))
        .then((package) => package.serve({ packageType: 'zip' }))
        .then((base64) => {
            // window.location = `data:application/zip;base64,${base64}`;
            // sometimes it doesn't work by use window.location directly, so change to this way
            const link = document.createElement('a');
            link.href = `data:application/zip;base64,${base64}`;
            link.download = 'ar.zip';
            link.click();
        });
};

/**
 * Stores the session data and redirects to publish page.
 *
 * @param {event} event
 */
const publish = () => {
    // Проверка необходимых данных
    if (!window.markerImage) return alert('Пожалуйста, выберите изображение маркера');
    if (!window.assetType) return alert('Пожалуйста, выберите тип контента');
    if (!window.assetFile || !window.assetName) return alert('Пожалуйста, загрузите контент');

    // Определение типа контента на основе расширения файла
    let contentType;
    const fileExtension = window.assetName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        contentType = 'Изображение';
    } else if (['mp4'].includes(fileExtension)) {
        contentType = 'Видео';
    } else if (['gltf', 'glb', 'zip'].includes(fileExtension)) {
        contentType = '3D Объект';
    } else {
        contentType = 'Неизвестный тип';
    }

    // Получение паттерна маркера
    MarkerModule.getMarkerPattern(window.markerImage)
        .then((markerPattern) => new Package({
            arType: 'pattern',
            assetType: window.assetType, // image/audio/video/3d
            assetFile: window.assetFile,
            assetName: window.assetName,
            assetParam: window.assetParam,
            markerPatt: markerPattern
        }))
        .then((package) => package.serve({ packageType: 'zip' }))
        .then((base64) => {
            // Создание Blob-объекта из base64 данных
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/zip' });

            // Отправка на сервер через fetch
            const formData = new FormData();
            formData.append('zipFile', blob, 'ar.zip');

            return fetch('/create-package', {
                method: 'POST',
                body: formData
            });
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Не удалось отправить пакет');
            }
        })
        .then(data => {
            console.log('Пакет создан в папке:', data.folderName);

            // Получение тени DOM футера и элемента project-name
            const footerElement = document.querySelector('page-footer');
            const footerShadow = footerElement ? footerElement.shadowRoot : null;
            const projectNameInput = footerShadow ? footerShadow.querySelector('#project-name') : null;
            const projectName = projectNameInput ? projectNameInput.value : 'Без названия';

            // Создание полного URL для QR-кода
            const qrCodeUrl = `${window.location.origin}/packages/${data.folderName}/index.html`;

            const postData = {
                fields: [
                    { name: projectName },
                    { added_date: new Date().toISOString().split('T')[0] }, // Пример даты в формате YYYY-MM-DD
                    { ar_marker: 'Маркер' }, // Используйте правильный идентификатор маркера
                    { content: contentType },
                    { qr_code: qrCodeUrl }
                ]
            };

            // Отправка данных о проекте в базу данных
            return fetch('/api/objects/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
        })
        .then(response => {
            if (response.ok) {
                // Показать сообщение об успешном добавлении
                showSuccessMessage();
            } else {
                throw new Error('Не удалось добавить объект в базу данных');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error.message);
        });
}

/**
 * Показывает сообщение об успешном добавлении проекта и перенаправляет пользователя на /dashboard после нажатия на кнопку "ОК".
 */
const showSuccessMessage = () => {
    // Создание модального окна
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Создание содержимого модального окна
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.textAlign = 'center';

    // Добавление текста сообщения
    const message = document.createElement('p');
    message.textContent = 'Проект успешно добавлен!';
    modalContent.appendChild(message);

    // Создание кнопки "ОК"
    const okButton = document.createElement('button');
    okButton.textContent = 'ОК';
    okButton.style.marginTop = '10px';
    okButton.style.padding = '10px 20px';
    okButton.style.border = 'none';
    okButton.style.backgroundColor = '#007bff';
    okButton.style.color = '#fff';
    okButton.style.borderRadius = '4px';
    okButton.style.cursor = 'pointer';
    okButton.addEventListener('click', () => {
        // Закрытие модального окна
        document.body.removeChild(modal);

        // Перенаправление на /dashboard
        window.location.href = '/dashboard';
    });
    modalContent.appendChild(okButton);

    // Добавление содержимого в модальное окно
    modal.appendChild(modalContent);

    // Добавление модального окна на страницу
    document.body.appendChild(modal);
}


zipButton.addEventListener('click', zip);
githubButton.addEventListener('click', publish);
