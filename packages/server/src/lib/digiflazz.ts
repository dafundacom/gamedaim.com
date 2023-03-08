import crypto from "crypto"

type PriceListType = "prepaid" | "pasca"

type TransactoinType = null | "inq-pasca" | "pay-pasca" | "status-pasca"

export default class Digiflazz {
  private _user: string
  private _key: string
  private _keyWebhooks: string
  private _endpoint: string

  constructor(username: string, key: string, webhook: string = null) {
    this._user = username
    this._key = key
    this._keyWebhooks = webhook
    this._endpoint = "https://api.digiflazz.com/v1"
  }

  async cekSaldo() {
    const options = {
      cmd: "deposit",
      username: this._user,
      sign: crypto
        .createHash("md5")
        .update(`${this._user}${this._key}depo`)
        .digest("hex"),
    }

    return await fetch(`${this._endpoint}/cek-saldo`, {
      method: "POST",
      body: JSON.stringify(options),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })
      .catch(function (err) {
        throw err
      })
  }

  async daftarHarga(cmdOption: PriceListType) {
    const options = {
      cmd: cmdOption,
      username: this._user,
      sign: crypto
        .createHash("md5")
        .update(`${this._user}${this._key}pricelist`)
        .digest("hex"),
    }

    return await fetch(`${this._endpoint}/price-list`, {
      method: "POST",
      body: JSON.stringify(options),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })
      .catch(function (err) {
        throw err
      })
  }

  async deposit(amount: number, bank: string, name: string) {
    const options = {
      username: this._user,
      amount: amount,
      Bank: bank,
      owner_name: name,
      sign: crypto
        .createHash("md5")
        .update(`${this._user}${this._key}deposit`)
        .digest("hex"),
    }

    return await fetch(`${this._endpoint}/deposit`, {
      method: "POST",
      body: JSON.stringify(options),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })
      .catch(function (err) {
        throw err
      })
  }

  async transaksi(
    sku: string,
    customerNo: string,
    refId: string,
    cmd: TransactoinType = null,
    testing: boolean,
    msg: string,
  ) {
    const options = {
      username: this._user,
      buyer_sku_code: sku,
      customer_no: customerNo,
      ref_id: refId,
      testing: testing,
      msg: msg,
      commands: cmd,
      sign: crypto
        .createHash("md5")
        .update(`${this._user}${this._key}${refId}`)
        .digest("hex"),
    }

    /** NOTE:
    inq-pasca: cek tagihan
    pay-pasca: bayar tagihan
    status-pasca: cek status tagihan

    ** Jangan pernah mencoba untuk melakukan Cek Status terhadap transaksi yang sudah lewat 90 HARI karena hal tersebut akan menyebabkan pembuatan transaksi BARU. **
    **/

    if (cmd === "inq-pasca") options.commands = "inq-pasca"
    if (cmd === "pay-pasca") options.commands = "pay-pasca"
    if (cmd === "status-pasca") options.commands = "status-pasca"

    return await fetch(`${this._endpoint}/transaction`, {
      method: "POST",
      body: JSON.stringify(options),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })
      .catch(function (err) {
        throw err
      })
  }

  async cekIdPln(customerNo: string) {
    const options = {
      customer_no: customerNo,
      commands: "pln-subscribe",
    }

    return await fetch(`${this._endpoint}/transaction`, {
      method: "POST",
      body: JSON.stringify(options),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })
      .catch(function (err) {
        throw err
      })
  }

  static webhook(middle: Digiflazz) {
    return function middleHandler(
      req: Request,
      res: Response,
      next: () => void,
    ) {
      middle.onWebhook(req, res, next)
      next()
    }
  }

  onWebhook(req: any, res: any, _next: any) {
    const hmac =
      "sha1=" +
      crypto
        .createHmac("sha1", this._keyWebhooks)
        .update(JSON.stringify(req.body))
        .digest("hex")

    if (req.headers["x-hub-signature"] === hmac) {
      req.digiwebhooks = {
        event: req.headers["x-digiflazz-event"],
        delivery: req.headers["x-digiflazz-delivery"],
        data: req.body.data,
      }
    }
    res.json({ msg: "received" })
  }
}
