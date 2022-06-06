import Link from 'next/link'
import React from 'react'

function DashboardCards({
  projectName,
  dashboardName,
  dashboardId,
  description,
}: {
  projectName: string
  dashboardName: string
  dashboardId: string
  description: string
}) {
  return (
    <Link
      href={`/project/${projectName}/dashboard/${encodeURIComponent(
        dashboardId
      )}`}
    >
      <a className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
        <h3 className="text-2xl font-bold">{dashboardName} &rarr;</h3>
        <p className="mt-4 text-xl truncate">{description}</p>
      </a>
    </Link>
  )
}

export default DashboardCards
