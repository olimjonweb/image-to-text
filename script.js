document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const statusMessage = document.getElementById('statusMessage');
    const resultContainer = document.getElementById('resultContainer');

    // Drag and drop funksionalligi
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Fayl tanlash
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    // Faylni tekshirish
    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            statusMessage.textContent = `Tanlangan fayl: ${file.name}`;
            statusMessage.style.color = '#4CAF50';
            convertBtn.disabled = false;
            resultContainer.style.display = 'none';
        } else {
            statusMessage.textContent = 'Iltimos, faqat rasm fayllarini tanlang';
            statusMessage.style.color = '#dc3545';
            convertBtn.disabled = true;
        }
    }

    // Konvertatsiya qilish
    convertBtn.addEventListener('click', () => {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        statusMessage.textContent = 'Matn ajratib olinmoqda...';
        statusMessage.style.color = '#4CAF50';
        convertBtn.disabled = true;

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Natijani ko'rsatish
                statusMessage.textContent = data.message;
                
                // Matnni ko'rsatish
                const textDisplay = document.createElement('div');
                textDisplay.className = 'result-text';
                textDisplay.textContent = data.text;
                
                // Yuklab olish tugmasini yaratish
                const downloadBtn = document.createElement('a');
                downloadBtn.href = data.download_url;
                downloadBtn.className = 'download-btn';
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Word faylini yuklab olish';
                
                // Natijalar konteyneriga qo'shish
                resultContainer.innerHTML = '';
                resultContainer.appendChild(textDisplay);
                resultContainer.appendChild(downloadBtn);
                resultContainer.style.display = 'block';
            } else {
                throw new Error(data.error || 'Xatolik yuz berdi');
            }
        })
        .catch(error => {
            statusMessage.textContent = error.message;
            statusMessage.style.color = '#dc3545';
        })
        .finally(() => {
            convertBtn.disabled = false;
        });
    });

    // Barcha sahifa elementlariga animatsiya qo'shish
    const pageElements = document.querySelectorAll('.page-transition');
    pageElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });

    // Havolalar uchun animatsiya
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Sahifani sekin yashirish
            document.body.style.opacity = '0';
            
            // Yangi sahifaga o'tish
            setTimeout(() => {
                window.location.href = href;
            }, 150);
        });
    });
}); 