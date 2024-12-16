const backgroundUrls = [
    "https://static.remove.bg/backgrounds/product/art-artistic-background-1279813-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/Nature/background-clouds-colors-726330-size-156.jpg",
    "https://static.remove.bg/backgrounds/product/antique-backdrop-background-164005-size-156.jpg",
    "https://static.remove.bg/backgrounds/car/new/bg3-size-156.png",
    "https://static.remove.bg/backgrounds/realestate/background-3104413_1920-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/Autumn/dawn-desktop-wallpaper-environment-2055389-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/Urban/architecture-building-business-2339009-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/new/pride_gradient-size-156.png",
    "https://static.remove.bg/backgrounds/realestate/pexels-pixabay-531756-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/new/pexels-zaksheuskaya-1561020-size-156.jpg",
    "https://i.pinimg.com/736x/d0/09/52/d00952ba351f7b7f0905a4a9465b6fc8.jpg",
    "https://i.pinimg.com/736x/33/92/a6/3392a60bb7a4c4ec72f8bef181a9f556.jpg"
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
        };
        reader.readAsDataURL(file);
    }
});


document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.shape-btn').forEach(button => button.classList.remove('active'));
        this.classList.add('active');
        const shape = this.dataset.shape;
        const imageContainer = document.querySelector('.image-container');

        imageContainer.classList.remove('circle-shape', 'square-shape', 'oval-shape', 'rect-shape', 'potrait-shape', 'custom-shape', 'custom2-shape', 'custom3-shape', 'custom4-shape', 'custom5-shape', 'custom6-shape');

        if (shape) {
            imageContainer.classList.add(`${shape}-shape`)
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

        let width = 400;
        let height = (400 * aspectHeight) / aspectWidth;

        const imageContainer = document.querySelector('.image-container');
        const widthInd = document.getElementById('width');
        const heightInd = document.getElementById('height');

        imageContainer.style.width = `${Math.round(width)}px`;
        imageContainer.style.height = `${Math.round(height)}px`;
        widthInd.innerText = `Width ${aspectWidth} inch (${aspectWidth * 2.54} cm)`;
        heightInd.innerText = `Height ${aspectHeight} inch (${aspectHeight * 2.54} cm)`;

        document.querySelectorAll('.circle-shape, .square-shape, .oval-shape, .custom-shape, .rect-shape').forEach(shape => {
            if (shape.classList.contains('circle-shape')) {
                shape.style.width = `${Math.round(height)}px`;
                shape.style.height = `${Math.round(height)}px`;
            } else if (shape.classList.contains('rect-shape')) {
                shape.style.width = `${Math.round(width)}px`;
                shape.style.height = `${Math.round(width) - 100}px`;
            } else {
                shape.style.width = `${Math.round(width)}px`;
                shape.style.height = `${Math.round(height)}px`;
            }
        });

        if (aspectWidth === 11 && aspectHeight === 11 || aspectWidth === 16 && aspectHeight === 16) {
            document.querySelectorAll('.shape-btn').forEach(button => {
                if (button.classList.contains('oval') || button.classList.contains('rect') || button.classList.contains('potrait')) {
                    button.style.display = 'none';
                } else {
                    button.style.display = 'inline-block';
                }
            });
        } else {
            document.querySelectorAll('.shape-btn').forEach(button => {
                if (button.classList.contains('potrait') || button.classList.contains('rect') || button.classList.contains('circle') || button.classList.contains('custom3') || button.classList.contains('custom4') || button.classList.contains('custom5')) {
                    button.style.display = 'none';
                } else {
                    button.style.display = 'inline-block';
                }
            });
        }
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
