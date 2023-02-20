import * as React from "react"
import { Dialog as ModalBase, Transition } from "@headlessui/react"
import { Button, CrossIcon } from "ui"

interface ModalProps {
  desc?: React.ReactNode
  placeholder?: string
  isOpen: boolean
  onClose: () => void
  className?: string
  onDelete: () => void
}

export const ModalDelete: React.FunctionComponent<ModalProps> = (props) => {
  const { desc, isOpen, onClose, className, onDelete } = props

  const completeButtonRef = React.useRef(null)
  function handleDeleteAndClose() {
    onDelete()
    onClose()
  }
  return (
    <div className={className}>
      <Transition show={isOpen} as={React.Fragment}>
        <ModalBase
          initialFocus={completeButtonRef}
          as="div"
          className="fixed inset-0 z-[9999] overflow-y-auto"
          open={isOpen}
          onClose={onClose}
        >
          <ModalBase.Overlay className="fixed top-0 left-0 h-screen w-screen bg-gray-600 opacity-80" />
          <Transition.Child
            as={React.Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <div className="relative mx-auto my-24 flex w-full flex-col rounded shadow-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 max-w-[500px]">
              <button
                onClick={onClose}
                className="cursor-base hover:text-primary-500 absolute top-4 right-4 text-sm text-gray-600 dark:text-gray-400"
              >
                <CrossIcon className="h-4 w-4" />
              </button>
              <div className="flex-1 p-6">
                <p className="text-base font-normal text-gray-500">
                  Are you sure to delete {desc}?
                </p>
                <div className="flex justify-between mt-4">
                  <Button
                    className="!bg-red-700"
                    onClick={handleDeleteAndClose}
                  >
                    Yes
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </ModalBase>
      </Transition>
    </div>
  )
}
