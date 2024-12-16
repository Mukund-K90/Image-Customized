const backgroundUrls = [
    "https://static.remove.bg/backgrounds/product/art-artistic-background-1279813-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/Nature/background-clouds-colors-726330-size-156.jpg",
    "https://static.remove.bg/backgrounds/product/antique-backdrop-background-164005-size-156.jpg",
    "https://static.remove.bg/backgrounds/car/new/bg3-size-156.png",
    "https://static.remove.bg/backgrounds/realestate/background-3104413_1920-size-156.jpg"
];
const imageContainer = document.getElementById('imageContainer');
const previewImage = document.getElementById('previewImage');
const fileInput = document.getElementById('fileInput');
const widthInd = document.getElementById('width');
const heightInd = document.getElementById('height');


let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            previewImage.style.transform = 'translate(0px, 0px) scale(1)';
            centerImage();
        };
        reader.readAsDataURL(file);
    }
});

function centerImage() {
    previewImage.onload = function () {
        const containerRect = imageContainer.getBoundingClientRect();
        const imageRect = previewImage.getBoundingClientRect();

        const currentX = (containerRect.width - imageRect.width) / 2;
        const currentY = (containerRect.height - imageRect.height) / 2;

        previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(1)`;
    };
}

document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.shape-btn').forEach(button => button.classList.remove('active'));
        this.classList.add('active');
        const shape = this.dataset.shape;
        const imageContainer = document.querySelector('.image-container');

        imageContainer.classList.remove('circle-shape', 'square-shape', 'oval-shape', 'custom-shape', 'rect-shape');

        switch (shape) {
            case 'circle':
                imageContainer.classList.add('circle-shape');
                break;
            case 'square':
                imageContainer.classList.add('square-shape');
                break;
            case 'oval':
                imageContainer.classList.add('oval-shape');
                break;
            case 'custom':
                imageContainer.classList.add('custom-shape');
                break;
            case 'rect':
                imageContainer.classList.add('rect-shape');
                break;
        }
    });
});

document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        imageContainer.style.border = `${this.style.border}`;
    });
});

imageContainer.addEventListener('dblclick', dragStart);
imageContainer.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    if (!isDragging) {
        isDragging = true;

        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();

        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        updateImagePosition();
    }
}

function dragEnd() {
    if (isDragging) {
        isDragging = false;
    }
}

function updateImagePosition() {
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

const zoomRange = document.getElementById('zoomRange');
let scale = 1;

zoomRange.addEventListener('input', function () {
    scale = parseFloat(zoomRange.value);
    updateImagePosition();
});

function updateImagePosition() {
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

function centerImage() {
    previewImage.onload = function () {
        const containerRect = imageContainer.getBoundingClientRect();
        const imageRect = previewImage.getBoundingClientRect();

        currentX = (containerRect.width - imageRect.width) / 2;
        currentY = (containerRect.height - imageRect.height) / 2;
        xOffset = currentX;
        yOffset = currentY;

        updateImagePosition();
    }
}

const downloadBtn = document.getElementById('downloadBtn');

downloadBtn.addEventListener('click', () => {
    html2canvas(imageContainer, { backgroundColor: null }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'customized-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.size-btn').forEach(button => button.classList.remove('active'));
        this.classList.add('active');
        const ratio = this.dataset.ratio.split('/');
        const aspectWidth = parseFloat(ratio[0]);
        const aspectHeight = parseFloat(ratio[1]);

        let width = 600;
        let height = (600 * aspectHeight) / aspectWidth;

        const imageContainer = document.querySelector('.image-container');

        imageContainer.style.width = `${Math.round(width)}px`;
        imageContainer.style.height = `${Math.round(height)}px`;
        widthInd.innerText = `Width ${aspectWidth} inch (${aspectWidth * 2.54} cm)`;
        heightInd.innerText = `Height ${aspectHeight} inch (${aspectHeight * 2.54} cm)`;

        document.querySelectorAll('.circle-shape, .square-shape, .oval-shape, .custom-shape, .rect-shape').forEach(shape => {
            if (shape.classList.contains('circle-shape')) {
                shape.style.width = `${Math.round(height)}px`;
                shape.style.height = `${Math.round(height)}px`;
            }
            else if (shape.classList.contains('rect-shape')) {
                shape.style.width = `${Math.round(width)}px`;
                shape.style.height = `${Math.round(width) - 100}px`;
            }
            else {
                shape.style.width = `${Math.round(width)}px`;
                shape.style.height = `${Math.round(height)}px`;
            }
        });
    });
});
const removeBgBtn = document.getElementById('removeBgBtn');
removeBgBtn.addEventListener('click', openBgModal);

function openBgModal() {
    const bgGallery = document.getElementById('bgGallery');
    bgGallery.innerHTML = '';

    backgroundUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Background Image';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => selectBackground(url));
        bgGallery.appendChild(img);
    });

    document.getElementById('bgModal').style.display = 'block';
}

function closeBgModal() {
    document.getElementById('bgModal').style.display = 'none';
}

function selectBackground(selectedBgUrl) {
    const previewImage = document.getElementById('previewImage');

    changeBackgroundAPI(selectedBgUrl, previewImage.src);
    closeBgModal();
}

async function changeBackgroundAPI(backgroundUrl, originalImageUrl) {
    const imageBlob = await fetch(originalImageUrl)
        .then(res => res.blob())
        .catch(error => {
            console.error('Error fetching image blob:', error);
            return null;
        });

    if (!imageBlob) {
        alert('Failed to fetch image blob');
        return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        try {
            const response = await fetch('/change-bg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageBlob: base64String,
                    backgroundUrl: backgroundUrl
                })
            });

            const data = await response.json();

            if (data.success) {
                const bufferData = new Uint8Array(data.rbgResultData.data);
                const imageUrl = URL.createObjectURL(new Blob([bufferData], { type: 'image/png' }));
                previewImage.src = imageUrl;
            } else {
                console.error('Failed to remove background:', data.error);
                alert('Failed to remove background');
            }
        } catch (error) {
            console.error('Error removing background:', error);
            alert('Failed to remove background');
        }
    };
    reader.readAsDataURL(imageBlob);
}
