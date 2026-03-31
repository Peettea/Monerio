// src/calculators/chart-theme.js
// Global Chart.js theme — Monerio dark premium design system

import { Chart, defaults } from 'chart.js/auto'
import { formatCZK } from './shared.js'

export const COLORS = {
  gold: '#D4AF37',
  goldAlpha: 'rgba(212, 175, 55, 0.25)',
  blue: '#0055A4',
  blueAlpha: 'rgba(0, 85, 164, 0.3)',
  cyan: '#00B4D8',
  cyanAlpha: 'rgba(0, 180, 216, 0.25)',
  red: '#ef4444',
  redAlpha: 'rgba(239, 68, 68, 0.2)',
  green: '#22c55e',
  greenAlpha: 'rgba(34, 197, 94, 0.2)',
  muted: '#8A95A8',
  text: '#F0F2F5',
  grid: 'rgba(138, 149, 168, 0.08)',
  tooltipBg: 'rgba(6, 9, 19, 0.95)',
  tooltipBorder: 'rgba(212, 175, 55, 0.2)',
}

// Apply global defaults
defaults.color = COLORS.muted
defaults.font.family = 'Inter, sans-serif'
defaults.font.size = 12
defaults.responsive = true
defaults.maintainAspectRatio = false
defaults.animation = { duration: 600, easing: 'easeOutQuart' }

// Legend
defaults.plugins.legend.labels.usePointStyle = true
defaults.plugins.legend.labels.padding = 16
defaults.plugins.legend.labels.font = { size: 12, family: 'Inter, sans-serif' }

// Tooltip
defaults.plugins.tooltip.backgroundColor = COLORS.tooltipBg
defaults.plugins.tooltip.borderColor = COLORS.tooltipBorder
defaults.plugins.tooltip.borderWidth = 1
defaults.plugins.tooltip.padding = 12
defaults.plugins.tooltip.cornerRadius = 8
defaults.plugins.tooltip.titleFont = { family: 'Montserrat, sans-serif', weight: '600', size: 13 }
defaults.plugins.tooltip.bodyFont = { family: 'Inter, sans-serif', size: 12 }

// Grid
defaults.scales = {
  x: { grid: { color: COLORS.grid, drawBorder: false }, border: { display: false } },
  y: { grid: { color: COLORS.grid, drawBorder: false }, border: { display: false } },
}

// Helper: create gradient fill for area charts
export function createGradient(ctx, color, alphaTop = 0.35, alphaBottom = 0.02) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight)
  const rgb = hexToRgb(color)
  gradient.addColorStop(0, `rgba(${rgb}, ${alphaTop})`)
  gradient.addColorStop(1, `rgba(${rgb}, ${alphaBottom})`)
  return gradient
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

// Tooltip callback: format as CZK
export function tooltipCZK(ctx) {
  return ' ' + formatCZK(ctx.parsed.y || ctx.parsed || 0)
}

export { Chart }
