import { Input } from "@/../../ui"
import { InputLeftElement } from "@/../../ui/src/form/input-element"
import { InputGroup } from "@/../../ui/src/form/input-group"
import { useRouter } from "next/router"
import * as React from "react"
import { MdSearch } from "react-icons/md"

interface SearchInputProps {
  onSearch?: (query: string) => void
}

export const SearchInput = ({ onSearch }: SearchInputProps) => {
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
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit} autoComplete="off">
        <InputGroup size="md">
          <InputLeftElement>
            <MdSearch />
          </InputLeftElement>
          <Input
            type="search"
            className="!rounded-lg !border-none"
            name="q"
            onChange={handleChange}
            autoComplete="off"
            placeholder="Search..."
            required
          />
        </InputGroup>
      </form>
    </div>
  )
}
