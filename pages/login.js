function togglePassword() {
    const pwdInput = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eyeIcon');
    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        pwdInput.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
        x: { display: false },
        y: { display: false }
    },
    elements: {
        point: { radius: 0 },
        line: { tension: 0.4 }
    },
    animation: {
        duration: 800,
        easing: 'linear'
    }
};

const ctxBtc = document.getElementById('btcChart').getContext('2d');

let gradientBtc = ctxBtc.createLinearGradient(0, 0, 0, 400);
gradientBtc.addColorStop(0, 'rgba(247, 147, 26, 0.2)');   
gradientBtc.addColorStop(1, 'rgba(247, 147, 26, 0)');

let btcData = Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 60000);

const btcChart = new Chart(ctxBtc, {
    type: 'line',
    data: {
        labels: Array.from({length: 30}, (_, i) => i),
        datasets: [{
            data: btcData,
            borderColor: 'rgba(247, 147, 26, 0.6)',
            backgroundColor: gradientBtc,
            borderWidth: 2,
            fill: true
        }]
    },
    options: commonOptions
});

const ctxEth = document.getElementById('ethChart').getContext('2d');

let gradientEth = ctxEth.createLinearGradient(0, 0, 0, 400);
gradientEth.addColorStop(0, 'rgba(98, 126, 234, 0.2)');   
gradientEth.addColorStop(1, 'rgba(98, 126, 234, 0)');

let ethData = Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 3000);

const ethChart = new Chart(ctxEth, {
    type: 'line',
    data: {
        labels: Array.from({length: 30}, (_, i) => i),
        datasets: [{
            data: ethData,
            borderColor: 'rgba(98, 126, 234, 0.6)',
            backgroundColor: gradientEth,
            borderWidth: 2,
            fill: true
        }]
    },
    options: commonOptions
});

setInterval(() => {
    const lastBtc = btcChart.data.datasets[0].data[btcChart.data.datasets[0].data.length - 1];
    const newBtc = lastBtc + (Math.random() - 0.5) * 500;
    btcChart.data.datasets[0].data.push(newBtc);
    btcChart.data.datasets[0].data.shift();
    btcChart.update('none');

    const lastEth = ethChart.data.datasets[0].data[ethChart.data.datasets[0].data.length - 1];
    const newEth = lastEth + (Math.random() - 0.5) * 40;
    ethChart.data.datasets[0].data.push(newEth);
    ethChart.data.datasets[0].data.shift();
    ethChart.update('none');
}, 1000);