import { projects, getAllTechTags } from "@/data/projects"

const Hero = () => {
  const categories = ["open-source", "documentation", "production-grade"]
  const totalProjects = projects.length
  const totalCategories = categories.length
  const totalTech = getAllTechTags().length

  return (
    <section
      className="py-16 px-6 text-center"
      style={{ backgroundColor: "#0B0F19", color: "white" }}
    >
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
        <span
          className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text"
          style={{ WebkitTextFillColor: "transparent", color: "transparent" }}
        >
          Muhammad Ibtisam
        </span>
      </h1>
      <p className="text-2xl mb-2" style={{ color: "#D1D5DB" }}>DevOps Engineer</p>
      <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "#9CA3AF" }}>
        Production-grade deployments. Real pipelines. Documented work.
      </p>

      <div className="flex flex-wrap justify-center gap-8 text-center">
        <div className="px-6 py-4 rounded-lg" style={{ backgroundColor: "#12182A", border: "1px solid #374151" }}>
          <p className="text-3xl font-bold" style={{ color: "#A78BFA" }}>{totalProjects}</p>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Projects</p>
        </div>
        <div className="px-6 py-4 rounded-lg" style={{ backgroundColor: "#12182A", border: "1px solid #374151" }}>
          <p className="text-3xl font-bold" style={{ color: "#A78BFA" }}>{totalCategories}</p>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Categories</p>
        </div>
        <div className="px-6 py-4 rounded-lg" style={{ backgroundColor: "#12182A", border: "1px solid #374151" }}>
          <p className="text-3xl font-bold" style={{ color: "#A78BFA" }}>{totalTech}+</p>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Tools</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
