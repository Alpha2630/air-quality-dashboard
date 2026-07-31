export const RiskBandPlugin = {
  id: 'riskBand',
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;
    const x1 = scales.x.getPixelForValue(14);
    const x2 = scales.x.getPixelForValue(17);
    ctx.save();
    ctx.fillStyle = 'rgba(0,144,255,0.08)';
    ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.bottom - chartArea.top);
    ctx.restore();
  },
};