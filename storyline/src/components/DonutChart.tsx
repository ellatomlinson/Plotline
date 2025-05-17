type DonutChartProps = {
  percentage: number
}

const DonutChart = ({ percentage }: DonutChartProps) => {
  const radius = 70
  const stroke = 11
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <svg height={radius * 2} width={radius * 2}>
      {/* Background circle */}
      <circle
        stroke='rgb(209, 209, 214)'
        fill='transparent'
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* Progress circle */}
      <circle
        stroke='#000000'
        fill='transparent'
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap='round'
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      {/* Text in center */}
      <text x='50%' y='50%' textAnchor='middle' dy='.3em' fontSize='35'>
        {percentage}%
      </text>
    </svg>
  )
}

export default DonutChart
