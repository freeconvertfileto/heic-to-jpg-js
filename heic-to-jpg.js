(function() {
    var uploadArea = document.getElementById('h2jUploadArea');
    var browseBtn = document.getElementById('h2jBrowseBtn');
    var fileInput = document.getElementById('h2jFileInput');
    var controls = document.getElementById('h2jControls');
    var fileName = document.getElementById('h2jFileName');
    var fileSize = document.getElementById('h2jFileSize');
    var qualitySlider = document.getElementById('h2jQuality');
    var qualityVal = document.getElementById('h2jQualityVal');
    var convertBtn = document.getElementById('h2jConvertBtn');
    var newBtn = document.getElementById('h2jNewBtn');
    var progress = document.getElementById('h2jProgress');
    var result = document.getElementById('h2jResult');
    var origSize = document.getElementById('h2jOrigSize');
    var outSize = document.getElementById('h2jOutSize');
    var preview = document.getElementById('h2jPreview');
    var downloadLink = document.getElementById('h2jDownloadLink');
    var resetBtn = document.getElementById('h2jResetBtn');
    var errorBox = document.getElementById('h2jError');
    var errorMsg = document.getElementById('h2jErrorMsg');
    var errorReset = document.getElementById('h2jErrorReset');

    var currentFile = null;

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    }

    function showSection(id) {
        uploadArea.style.display = 'none';
        controls.style.display = 'none';
        progress.style.display = 'none';
        result.style.display = 'none';
        errorBox.style.display = 'none';
        var el = document.getElementById(id);
        if (el) el.style.display = '';
    }

    function loadFile(file) {
        if (!file) return;
        var ext = file.name.split('.').pop().toLowerCase();
        if (ext !== 'heic' && ext !== 'heif') {
            showError('Please select a HEIC or HEIF file.');
            return;
        }
        currentFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatBytes(file.size);
        showSection('h2jControls');
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        showSection('h2jError');
    }

    function resetTool() {
        currentFile = null;
        fileInput.value = '';
        if (downloadLink.href && downloadLink.href.startsWith('blob:')) {
            URL.revokeObjectURL(downloadLink.href);
        }
        showSection('h2jUploadArea');
        uploadArea.style.display = '';
    }

    if (qualitySlider) {
        qualitySlider.addEventListener('input', function() {
            qualityVal.textContent = qualitySlider.value;
        });
    }

    if (browseBtn) {
        browseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length) loadFile(fileInput.files[0]);
        });
    }

    if (uploadArea) {
        uploadArea.addEventListener('click', function() { fileInput.click(); });
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.classList.remove('drag-over');
        });
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
        });
    }

    if (newBtn) {
        newBtn.addEventListener('click', resetTool);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetTool);
    }

    if (errorReset) {
        errorReset.addEventListener('click', resetTool);
    }

    if (convertBtn) {
        convertBtn.addEventListener('click', function() {
            if (!currentFile) return;
            if (typeof heic2any === 'undefined') {
                showError('Conversion library failed to load. Please check your internet connection and try again.');
                return;
            }
            var quality = parseInt(qualitySlider.value, 10) / 100;
            showSection('h2jProgress');
            heic2any({ blob: currentFile, toType: 'image/jpeg', quality: quality })
                .then(function(outputBlob) {
                    var url = URL.createObjectURL(outputBlob);
                    preview.src = url;
                    origSize.textContent = formatBytes(currentFile.size);
                    outSize.textContent = formatBytes(outputBlob.size);
                    var baseName = currentFile.name.replace(/\.(heic|heif)$/i, '');
                    downloadLink.href = url;
                    downloadLink.download = baseName + '.jpg';
                    showSection('h2jResult');
                    result.style.display = 'flex';
                })
                .catch(function(err) {
                    showError('Conversion failed. The file may be corrupt or unsupported. Error: ' + (err && err.message ? err.message : String(err)));
                });
        });
    }
})();
