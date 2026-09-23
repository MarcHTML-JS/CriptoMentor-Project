const miniChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: { display: false },
    y: { display: false }
  },
  elements: {
    point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
    line: { tension: 0.4, borderWidth: 2 }
  },
  layout: {
    padding: 0
  }
};

const ctxMiniBtc = document.getElementById('miniBtcChart').getContext('2d');
let gradMiniBtc = ctxMiniBtc.createLinearGradient(0, 0, 0, 60);
gradMiniBtc.addColorStop(0, 'rgba(247, 147, 26, 0.3)'); 
gradMiniBtc.addColorStop(1, 'rgba(247, 147, 26, 0)');

new Chart(ctxMiniBtc, {
  type: 'line',
  data: {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [{
      data: [62000, 61500, 61800, 61200, 60900, 61100, 60500, 60800, 60300, 60100], 
      borderColor: '#f7931a',
      backgroundColor: gradMiniBtc,
      fill: true
    }]
  },
  options: miniChartOptions
});

const ctxMiniEth = document.getElementById('miniEthChart').getContext('2d');
let gradMiniEth = ctxMiniEth.createLinearGradient(0, 0, 0, 60);
gradMiniEth.addColorStop(0, 'rgba(98, 126, 234, 0.3)'); 
gradMiniEth.addColorStop(1, 'rgba(98, 126, 234, 0)');

new Chart(ctxMiniEth, {
  type: 'line',
  data: {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [{
      data: [3100, 3150, 3120, 3180, 3200, 3190, 3250, 3230, 3280, 3300], 
      borderColor: '#00ff88', 
      backgroundColor: gradMiniEth,
      fill: true
    }]
  },
  options: miniChartOptions
});