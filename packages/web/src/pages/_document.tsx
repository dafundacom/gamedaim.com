import Document, { Html, Main, Head, NextScript } from "next/document"
import install from "@twind/with-next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default install(MyDocument)
