import { projects } from "@/data/projects"

const Hero = () => {
  const platforms = projects.filter((p) => p.category === "platform").length
  const tools = projects.filter((p) => p.category === "tool").length
  const references = projects.filter((p) => p.category === "reference").length

  return (
    <section className="bg-gradient-to-b from-bg to-gray-900 py-16 px-6 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Muhammad Ibtisam
        </span>
      </h1>
      <p className="text-2xl text-gray-300 mb-2">DevOps Engineer</p>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
        Production-grade deployments. Real pipelines. Documented work.
      </p>

      <div className="flex flex-wrap justify-center gap-8 text-center">
        <div className="bg-card px-6 py-4 rounded-lg border border-gray-700">
          <p className="text-3xl font-bold text-purple-400">{projects.length}</p>
          <p className="text-sm text-gray-400">All</p>
        </div>
        <div className="bg-card px-6 py-4 rounded-lg border border-gray-700">
          <p className="text-3xl font-bold text-purple-400">{platforms}</p>
          <p className="text-sm text-gray-400">Platforms</p>
        </div>
        <div className="bg-card px-6 py-4 rounded-lg border border-gray-700">
          <p className="text-3xl font-bold text-purple-400">{references}</p>
          <p className="text-sm text-gray-400">References</p>
        </div>
        <div className="bg-card px-6 py-4 rounded-lg border border-gray-700">
          <p className="text-3xl font-bold text-purple-400">{tools}</p>
          <p className="text-sm text-gray-400">Tools</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
