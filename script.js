document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('audio');
    const playlist = document.getElementById('playlist');
    const fileInput = document.getElementById('fileInput');
    const visualizer = document.getElementById('visualizer');

    let audioContext;
    let analyser;
    let dataArray;
    let bars;

    fileInput.addEventListener('change', function () {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        for (const file of files) {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            listItem.addEventListener('click', function () {
                playSong(file);
            });
            playlist.appendChild(listItem);
        }
    }

    function playSong(file) {
        const objectURL = URL.createObjectURL(file);
        audio.src = objectURL;
        audio.play();
        initVisualizer();
    }
    function initVisualizer() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    
        // Clear existing bars
        if (bars) {
            bars.forEach(bar => visualizer.removeChild(bar));
        }
    
        bars = Array.from({ length: 10 }, (_, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.left = `${(index * 10)}%`; // Adjust the spacing between bars
            visualizer.appendChild(bar);
            return bar;
        });

        visualize();
    }

    function visualize() {
        analyser.getByteFrequencyData(dataArray);
        const maxHeight = visualizer.clientHeight;

        bars.forEach((bar, index) => {
            const barHeight = (dataArray[index] / 255) * maxHeight;
            bar.style.height = barHeight + 'px';
    
            // Set background color dynamically
            const randomColor = getRandomColor();
            bar.style.backgroundColor = randomColor;
        });
    
        requestAnimationFrame(visualize);
    }
    
    function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
    
});