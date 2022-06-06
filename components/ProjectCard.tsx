import Link from 'next/link'

function ProjectCard(props: any) {
  const { name, description } = props

  return (
    <Link href={`/project/${name}`}>
      <a className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
        <h3 className="text-2xl font-bold">{name} &rarr;</h3>
        <p className="mt-4 text-xl truncate">{description}</p>
      </a>
    </Link>
  )
}

export default ProjectCard
