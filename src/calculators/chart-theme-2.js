import Chart from 'chart.js/auto';

// Global Chart.js defaults for Monerio Dark Theme
Chart.defaults.color = 'rgba(255, 255, 255, 0.45)';
Chart.defaults.font.family = 'Inter, Arial, sans-serif';
Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.03)';
Chart.defaults.scale.grid.borderColor = 'transparent';

// Premium tooltip styling
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.85)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 12;
Chart.defaults.plugins.tooltip.padding = 14;
Chart.defaults.plugins.tooltip.titleFont = { family: 'Montserrat, sans-serif', weight: '600', size: 13 };
Chart.defaults.plugins.tooltip.bodyFont = { family: 'Inter, sans-serif', size: 13 };
Chart.defaults.plugins.tooltip.titleMarginBottom = 8;

// Subtle legend styling
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 20;

export const chartColors = {
    gold: {
        solid: '#d4af37',
        fill: 'rgba(212, 175, 55, 0.2)'
    },
    blue: {
        solid: '#3783d4',
        fill: 'rgba(55, 131, 212, 0.2)'
    },
    red: {
        solid: '#ff4c4c',
        fill: 'rgba(255, 76, 76, 0.2)'
    },
    gray: {
        solid: '#666666',
        fill: 'rgba(102, 102, 102, 0.2)'
    }
};

export function formatYAxisCurrency(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
    return value;
}
