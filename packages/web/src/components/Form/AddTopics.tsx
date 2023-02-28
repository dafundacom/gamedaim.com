import * as React from "react"
import toast from "react-hot-toast"
import { MdOutlineClose } from "react-icons/md"
import { Button, FormErrorMessage, Heading, Input } from "ui"
import { useForm } from "react-hook-form"
import { TopicDataProps } from "@/lib/data-types"
import axios from "axios"
interface FormValues {
  title: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
}
interface AddTopicsProps {
  topics: any
  addTopics: any
  selectedTopics: any
  addSelectedTopics: any
}
interface FormValues {
  title: string
}
export const AddTopics = (props: AddTopicsProps) => {
  const { topics, addTopics, selectedTopics, addSelectedTopics } = props
  console.log(selectedTopics)

  const [searchResults, setSearchResults] = React.useState([])
  const [inputValue, setInputValue] = React.useState("")

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({ mode: "onBlur" })

  const onSubmit = async (values: any) => {
    try {
      const { data } = await axios.post("/topic", values)
      addSelectedTopics((prev: any) => [...prev, data])
      addTopics((prev: any) => [...prev, data.id])
      if (data?.error) {
        toast.error(data.error)
      } else {
        reset()
        toast.success("Topic Successfully created")
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const assignTopic = (id: string | never) => {
    const checkedTopics = [...topics]
    const index = checkedTopics.indexOf(id as never)
    if (index === -1) {
      checkedTopics.push(id as never)
    } else {
      checkedTopics.splice(index, 1)
    }
    addTopics(checkedTopics)
  }
  const handleSearchChange = async (e: any) => {
    e.preventDefault()
    setInputValue(e.target.value)
    if (e.target.value.length > 1) {
      const { data } = await axios.get(`/topic/search/${e.target.value}`)

      setSearchResults(data)
    } else if (e.target.value.length < 1) {
      setSearchResults([])
    }
  }

  const handleSelectandAssign = (value: { id: string; title: string }) => {
    if (!selectedTopics.includes(value.title)) {
      setInputValue("")
      setSearchResults([])
      assignTopic(value.id)
      addSelectedTopics((prev: any) => [...prev, value])
    } else {
      toast.error(value.title + " telah dikirimkan")
      setInputValue("")
      setSearchResults([])
    }
  }
  //   const formHandler = (e) => {
  //     e.preventDefault()
  //     handleSubmit(onSubmit)
  //   }
  const handleRemoveValue = (value: any) => {
    const filteredResult = selectedTopics.filter(
      (item: any) => item.id !== value.id,
    )

    const filteredData = topics.filter((item: any) => item !== value.id)
    addSelectedTopics(filteredResult)
    addTopics(filteredData)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <Heading as="h3" size="md">
            Topics
          </Heading>
          <div className="rounded-md border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
            <div className="parent-focus flex max-w-[300px] flex-row flex-wrap items-center justify-start gap-2 p-2">
              {selectedTopics.length > 0 &&
                selectedTopics.map((topic: TopicDataProps) => {
                  return (
                    <>
                      <div className="flex items-center bg-gray-200 px-2 py-1 text-[14px] text-black dark:bg-gray-800 dark:text-white">
                        <span>{topic.title}</span>
                        <Button
                          as="div"
                          onClick={() => handleRemoveValue(topic)}
                          className="!h-auto !min-w-0 !bg-transparent !p-0 !text-inherit"
                        >
                          <MdOutlineClose />
                        </Button>
                      </div>
                    </>
                  )
                })}
              <Input
                type="text"
                {...register("title", {
                  required: "Title is Required",
                })}
                className="!h-auto !w-full !min-w-[50px] !max-w-full !shrink !grow !basis-0 !border-none !bg-transparent !p-0 focus:!border-none focus:!ring-0"
                id="searchTopic"
                value={inputValue}
                placeholder="Enter topics"
                onChange={handleSearchChange}
              />
              {errors?.title && (
                <FormErrorMessage>{errors.title.message}</FormErrorMessage>
              )}
            </div>
            {searchResults.length > 0 && (
              <ul className="border-t border-gray-300">
                {searchResults.map((searchTopic: TopicDataProps) => {
                  const dataTopics = {
                    id: searchTopic.id,
                    title: searchTopic.title,
                  }
                  return (
                    <li
                      key={searchTopic.id}
                      className="px-2 hover:bg-blue-500"
                      onClick={() => handleSelectandAssign(dataTopics)}
                    >
                      {searchTopic.title}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </form>
    </>
  )
}
