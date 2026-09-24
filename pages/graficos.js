document.addEventListener("DOMContentLoaded", () => {
  
  const track = document.getElementById('miniChartsTrack');
  const btnLeft = document.getElementById('btnSlideLeft');
  const btnRight = document.getElementById('btnSlideRight');

  if (btnRight && btnLeft && track) {
    btnRight.addEventListener('click', () => {
      track.scrollBy({ left: 240, behavior: 'smooth' });
    });

    btnLeft.addEventListener('click', () => {
      track.scrollBy({ left: -240, behavior: 'smooth' });
    });
  }

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
      line: { tension: 0, borderWidth: 2 } 
    },
    layout: {
      padding: { bottom: -5, left: -5, right: -5 }
    }
  };

  const ctxBtc = document.getElementById('miniBtcChart');
  if (ctxBtc) {
    let gradBtc = ctxBtc.getContext('2d').createLinearGradient(0, 0, 0, 100);
    gradBtc.addColorStop(0, 'rgba(247, 147, 26, 0.4)');
    gradBtc.addColorStop(1, 'rgba(247, 147, 26, 0)');

    new Chart(ctxBtc.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          data: [62000, 60500, 61800, 59200, 60900, 58100, 60500, 59800, 60300, 59100],
          borderColor: '#f7931a',
          backgroundColor: gradBtc,
          fill: true
        }]
      },
      options: miniChartOptions
    });
  }

  const ctxEth = document.getElementById('miniEthChart');
  if (ctxEth) {
    let gradEth = ctxEth.getContext('2d').createLinearGradient(0, 0, 0, 100);
    gradEth.addColorStop(0, 'rgba(98, 126, 234, 0.4)');
    gradEth.addColorStop(1, 'rgba(98, 126, 234, 0)');

    new Chart(ctxEth.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          data: [3100, 3150, 3020, 3180, 3100, 3290, 3150, 3230, 3180, 3300], 
          borderColor: '#00ff88', 
          backgroundColor: gradEth,
          fill: true
        }]
      },
      options: miniChartOptions
    });
  }

  const ctxSol = document.getElementById('miniSolChart');
  if (ctxSol) {
    let gradSol = ctxSol.getContext('2d').createLinearGradient(0, 0, 0, 100);
    gradSol.addColorStop(0, 'rgba(20, 241, 149, 0.4)');
    gradSol.addColorStop(1, 'rgba(20, 241, 149, 0)');

    new Chart(ctxSol.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          data: [140, 145, 138, 150, 148, 155, 152, 160, 158, 165], 
          borderColor: '#14F195', 
          backgroundColor: gradSol,
          fill: true
        }]
      },
      options: miniChartOptions
    });
  }

  const ctxAda = document.getElementById('miniAdaChart');
  if (ctxAda) {
    let gradAda = ctxAda.getContext('2d').createLinearGradient(0, 0, 0, 100);
    gradAda.addColorStop(0, 'rgba(0, 51, 173, 0.5)');
    gradAda.addColorStop(1, 'rgba(0, 51, 173, 0)');

    new Chart(ctxAda.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          data: [0.25, 0.24, 0.26, 0.23, 0.25, 0.22, 0.24, 0.23, 0.25, 0.24], 
          borderColor: '#00A3FF', 
          backgroundColor: gradAda,
          fill: true
        }]
      },
      options: miniChartOptions
    });
  }

  // Lógica de pestañas interactivas y rotación automática para las innovaciones
  const tabs = document.querySelectorAll('.feature-tab');
  const contents = document.querySelectorAll('.feature-content');
  const images = document.querySelectorAll('.feature-img');
  let currentIndex = 0;
  let slideInterval;

  function switchTab(index) {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    images.forEach(i => i.classList.remove('active'));

    tabs[index].classList.add('active');
    contents[index].classList.add('active');
    images[index].classList.add('active');
    currentIndex = index;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      switchTab(index);
      resetInterval();
    });
  });

  function nextTab() {
    currentIndex = (currentIndex + 1) % tabs.length;
    switchTab(currentIndex);
  }

  function startInterval() {
    slideInterval = setInterval(nextTab, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  if (tabs.length > 0) {
    startInterval();
  }

});