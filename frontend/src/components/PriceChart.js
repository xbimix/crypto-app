// PriceChart.js (simplified)
import React from 'react';
import { Line } from 'react-chartjs-2';

export default function PriceChart({ data }) {
  return <Line data={data} />;
}