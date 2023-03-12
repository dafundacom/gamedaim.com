import NextLink from "next/link"
import { Button } from "ui"
export const ListLinkTopup = () => {
  return (
    <div className="scrollbar scrollbarhide flex flex-nowrap gap-4 overflow-auto px-3">
      <NextLink href="/">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          Populer
        </Button>
      </NextLink>
      <NextLink href="/store/topup">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          Top up
        </Button>
      </NextLink>
      <NextLink href="/store/topup/voucher">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          Voucher
        </Button>
      </NextLink>
      <NextLink href="/store/topup/pulsadata">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          Pulsa & Data
        </Button>
      </NextLink>
      <NextLink href="/store/topup/e-wallet">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          E-Wallet
        </Button>
      </NextLink>
      <NextLink href="/store/topup/live-app">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          Live App
        </Button>
      </NextLink>
      <NextLink href="/store/topup/tagihan">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          Tagihan
        </Button>
      </NextLink>
      <NextLink href="/store/jasajoki">
        <Button
          variant="outline"
          className="!h-[unset] !rounded-lg !border-gray-300"
        >
          Jasa Joki
        </Button>
      </NextLink>
    </div>
  )
}
