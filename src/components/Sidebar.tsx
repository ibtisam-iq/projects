import { getAllTechTags, getAllCapabilityTags, getAllYears } from "@/data/projects"

interface SidebarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  selectedTech: string[]
  setSelectedTech: (tech: string[]) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  selectedYear: string
  setSelectedYear: (year: string) => void
}

const Sidebar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  selectedTech,
  setSelectedTech,
  selectedStatus,
  setSelectedStatus,
  selectedYear,
  setSelectedYear,
}: SidebarProps) => {
  const allTech = getAllTechTags()
  const allTags = getAllCapabilityTags()
  const allYears = getAllYears()

  const toggleTech = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech))
    } else {
      setSelectedTech([...selectedTech, tech])
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <aside className="bg-card p-6 rounded-lg border border-gray-700 sticky top-6 h-fit">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-bg border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-400">CATEGORY</h3>
        <div className="space-y-2">
          {["all", "platform", "tool"].map(
            (cat) => (
              <label
                key={cat}
                className="flex items-center cursor-pointer hover:text-purple-400 transition"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  className="mr-2 accent-purple-400"
                />
                <span className="capitalize">
                  {cat.replace("-", " ")}
                </span>
              </label>
            ),
          )}
        </div>
      </div>

      {/* Capabilities (tags) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-400">
          SKILLS
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allTags.map((tag) => (
            <label
              key={tag}
              className="flex items-center cursor-pointer hover:text-purple-400 transition"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="mr-2 accent-purple-400"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Technology */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-400">
          TOOLS
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allTech.map((tech) => (
            <label
              key={tech}
              className="flex items-center cursor-pointer hover:text-purple-400 transition"
            >
              <input
                type="checkbox"
                checked={selectedTech.includes(tech)}
                onChange={() => toggleTech(tech)}
                className="mr-2 accent-purple-400"
              />
              <span>{tech}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Year */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-400">YEAR</h3>
        <div className="space-y-2">
          {["all", ...allYears.map(String)].map((yr) => (
            <label
              key={yr}
              className="flex items-center cursor-pointer hover:text-purple-400 transition"
            >
              <input
                type="radio"
                name="year"
                value={yr}
                checked={selectedYear === yr}
                onChange={() => setSelectedYear(yr)}
                className="mr-2 accent-purple-400"
              />
              <span>{yr === "all" ? "All" : yr}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-purple-400">STATUS</h3>
        <div className="space-y-2">
          {["all", "completed", "in-progress", "maintained", "archived"].map(
            (stat) => (
              <label
                key={stat}
                className="flex items-center cursor-pointer hover:text-purple-400 transition"
              >
                <input
                  type="radio"
                  name="status"
                  value={stat}
                  checked={selectedStatus === stat}
                  onChange={() => setSelectedStatus(stat)}
                  className="mr-2 accent-purple-400"
                />
                <span className="capitalize">
                  {stat.replace("-", " ")}
                </span>
              </label>
            ),
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
