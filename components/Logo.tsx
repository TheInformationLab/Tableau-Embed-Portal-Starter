import React from 'react'

type Props = {
  height: number
}

function Logo({ height }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 600"
      className={`lg:block h-${height ? height : 8} w-auto`}
    >
      <path
        d="M341.64 158.34c0-85.87-69.62-155.47-155.48-155.47-85.85 0-155.46 69.6-155.46 155.47 0 85.88 69.61 155.48 155.46 155.48 85.87 0 155.48-69.61 155.48-155.48"
        fill="#3b97d3"
      />
      <path
        d="M324.85 516.13c0-44.14-35.78-79.89-79.89-79.89-44.14 0-79.91 35.75-79.91 79.89 0 44.11 35.76 79.89 79.91 79.89 44.11-.01 79.89-35.79 79.89-79.89"
        fill="#7ea9ba"
      />
      <path
        d="M170.13 415.86c0-41.21-33.42-74.64-74.63-74.64-41.21 0-74.61 33.42-74.61 74.64 0 41.21 33.4 74.62 74.61 74.62s74.63-33.41 74.63-74.62"
        fill="#f1893d"
      />
      <path
        d="M578.38 353.48c0-73.24-59.38-132.63-132.64-132.63-73.23 0-132.62 59.39-132.62 132.63 0 73.25 59.4 132.64 132.62 132.64 73.26 0 132.64-59.4 132.64-132.64"
        fill="#7383a9"
      />
      <circle cx="95.54" cy="564.89" r="28.17" fill="#010202" />
    </svg>
  )
}

export default Logo