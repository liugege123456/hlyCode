document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadButton = document.getElementById('downloadButton');
    const compressionControls = document.querySelector('.compression-controls');

    let originalImage = null;

    // 监听文件上传
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // 显示原始文件大小
            originalSize.textContent = `文件大小: ${formatFileSize(file.size)}`;
            
            // 创建文件预览
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.src = e.target.result;
                originalPreview.src = e.target.result;
                
                originalImage.onload = function() {
                    compressionControls.style.display = 'block';
                    compressImage(); // 初始压缩
                }
            }
            reader.readAsDataURL(file);
        }
    });

    // 监听压缩质量变化
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
        compressImage();
    });

    // 压缩图片
    function compressImage() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        // 在画布上绘制图片
        ctx.drawImage(originalImage, 0, 0);

        // 将画布内容转换为压缩后的图片
        const compressedDataUrl = canvas.toDataURL('image/jpeg', qualitySlider.value / 100);
        compressedPreview.src = compressedDataUrl;

        // 计算压缩后的文件大小
        const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        document.getElementById('compressedSize').textContent = `文件大小: ${formatFileSize(compressedSize)}`;

        // 显示下载按钮
        downloadButton.style.display = 'block';
        
        // 设置下载功能
        downloadButton.onclick = function() {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedDataUrl;
            link.click();
        };
    }

    // 格式化文件大小显示
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 