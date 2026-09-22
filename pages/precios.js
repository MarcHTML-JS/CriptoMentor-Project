// Lista de criptomonedas a consultar
const criptos = [
  { id: 'bitcoin', tickerId: 'ticker-btc', symbol: 'BTC' },
  { id: 'ethereum', tickerId: 'ticker-eth', symbol: 'ETH' },
  { id: 'solana', tickerId: 'ticker-sol', symbol: 'SOL' },
  { id: 'cardano', tickerId: 'ticker-ada', symbol: 'ADA' },
  { id: 'ripple', tickerId: 'ticker-xrp', symbol: 'XRP' },
  { id: 'dogecoin', tickerId: 'ticker-doge', symbol: 'DOGE' },
  { id: 'binancecoin', tickerId: 'ticker-bnb', symbol: 'BNB' },
  { id: 'avalanche-2', tickerId: 'ticker-avax', symbol: 'AVAX' },
  { id: 'polkadot', tickerId: 'ticker-dot', symbol: 'DOT' }
];

async function obtenerPrecios() {
  try {
    const ids = criptos.map(c => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    criptos.forEach(cripto => {
      const info = datos[cripto.id];
      if (!info) return;

      const precioUSD = info.usd;
      const cambioPercent = info.usd_24h_change;

      const esPositivo = cambioPercent >= 0;
      const claseColor = esPositivo ? 'up' : 'down';
      const signo = esPositivo ? '+' : '';

     
      const elementoTicker = document.getElementById(cripto.tickerId);
      if (elementoTicker) {
        elementoTicker.textContent = `${cripto.symbol} ${signo}${cambioPercent.toFixed(2)}%`;
        elementoTicker.className = claseColor;
      }

      
      const elementoTarjeta = document.getElementById(`card-${cripto.id}`);
      if (elementoTarjeta) {
        const pPrecio = elementoTarjeta.querySelector('.crypto-price');
        const pCambio = elementoTarjeta.querySelector('.crypto-change');

        const formatoPrecio = precioUSD < 1 ? `$${precioUSD.toFixed(4)}` : `$${precioUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        if (pPrecio) pPrecio.textContent = formatoPrecio;
        if (pCambio) {
          pCambio.textContent = `${signo}${cambioPercent.toFixed(2)}%`;
          pCambio.className = `crypto-change ${claseColor}`;
        }
      }
    });
  } catch (error) {
    console.error('Error cargando precios de criptomonedas:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  obtenerPrecios();
  
  setInterval(obtenerPrecios, 30000);
});