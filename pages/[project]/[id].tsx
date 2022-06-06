import { useRouter } from 'next/router'
import useSWR from 'swr'
import DashboardCard from '../../components/DashboardCard'
import FakeAuth from '../../components/FakeAuth'
import Layout from '../../components/Layout'
import { fetcher } from '../../lib/func'

export default function Project() {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(
    `/api/tableau?project=${id}&query=workbooks`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )
  if (data) {
    console.log(data)
  }
  return (
    <FakeAuth>
      <Layout>
        {data && !error && (
          <div className="max-w-7xl mx-auto h-full mt-6 items-center flex justify-around sm:w-full">
            <main className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {data?.data?.workbooks.length === 0 && (
                <p>No workbooks in this project</p>
              )}
              {data?.data?.workbooks.map((workbook: any, idx: number) => {
                return (
                  <DashboardCard
                    key={idx}
                    dashboardName={workbook.name}
                    dashboardId={workbook.id}
                    projectName={workbook.projectName}
                    description={workbook.description}
                  />
                )
              })}
            </main>
          </div>
        )}
      </Layout>
    </FakeAuth>
  )
}
