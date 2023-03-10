import * as React from "react"
import { Dialog as ModalBase, Transition } from "@headlessui/react"
import { CrossIcon } from "ui"

interface ModalProps {
  content?: React.ReactNode
  placeholder?: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export const PopupAd: React.FunctionComponent<ModalProps> = (props) => {
  const { content, isOpen, onClose, className } = props

  const completeButtonRef = React.useRef(null)

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
            <div className="relative mx-auto my-24 flex w-full max-w-[500px] flex-col rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={onClose}
                className="cursor-base hover:text-primary-500 absolute top-4 right-4 text-sm text-gray-600 dark:text-gray-400"
              >
                <CrossIcon className="h-4 w-4" />
              </button>
              <div className="flex-1 p-6">
                <p className="text-base font-normal text-gray-500">{content}</p>
              </div>
            </div>
          </Transition.Child>
        </ModalBase>
      </Transition>
    </div>
  )
}
