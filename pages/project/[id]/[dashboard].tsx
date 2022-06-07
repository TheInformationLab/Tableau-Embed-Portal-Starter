import React from 'react'
import { useRouter } from 'next/router'
import FakeAuth from '../../../components/FakeAuth'
import Layout from '../../../components/Layout'
import Breadcrumb from '../../../components/BreadCrumb'
import useSWR from 'swr'
import { fetcher } from '../../../lib/func'

export default function Dashboard() {
  const router = useRouter()
  const { id, dashboard } = router.query

  const { data, error } = useSWR(
    `/api/tableau?project=${dashboard}&query=workbook`,
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
        <Breadcrumb
          data={[
            { name: 'Projects', href: '/', current: false },
            { name: `${id}`, href: `/project/${id}`, current: false },
            { name: `${dashboard}`, href: '#', current: true },
          ]}
        />
        <div className="max-w-7xl mx-auto h-full mt-6 items-center flex sm:w-full">
          <div>
            {id} {dashboard}
            {/* <TableauEmbed tokenUrl='/api/tableau/token' viewUrl='' /> */}
          </div>
        </div>
      </Layout>
    </FakeAuth>
  )
}
