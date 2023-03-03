import * as React from "react"
import { useRouter } from "next/router"
import { MdSearch } from "react-icons/md"
import { Input } from "ui"

interface SearchInputProps {
  onSearch?: (query: string) => void
}

export const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  (props, ref) => {
    const { onSearch, ...rest } = props

    const [query, setQuery] = React.useState("")

    const router = useRouter()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/download/search?q=${encodeURIComponent(query)}`)
      }
    }

    return (
      <div ref={ref} {...rest}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Input.Group size="md">
            <Input.LeftElement>
              <MdSearch className="text-gray-800 dark:text-gray-200" />
            </Input.LeftElement>
            <Input
              type="search"
              className="!rounded-lg !border-none"
              name="q"
              onChange={handleChange}
              autoComplete="off"
              placeholder="Search..."
              required
            />
          </Input.Group>
        </form>
      </div>
    )
  },
)
