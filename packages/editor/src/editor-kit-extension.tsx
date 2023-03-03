import { Extension } from "@tiptap/core"
import { Blockquote, BlockquoteOptions } from "@tiptap/extension-blockquote"
import { Bold, BoldOptions } from "@tiptap/extension-bold"
import { BulletList, BulletListOptions } from "@tiptap/extension-bullet-list"
import {
  CharacterCount,
  CharacterCountOptions,
} from "@tiptap/extension-character-count"
import { Code, CodeOptions } from "@tiptap/extension-code"
import {
  CodeBlockLowlight,
  CodeBlockLowlightOptions,
} from "@tiptap/extension-code-block-lowlight"
import { Document } from "@tiptap/extension-document"
import { Dropcursor, DropcursorOptions } from "@tiptap/extension-dropcursor"
import { Gapcursor } from "@tiptap/extension-gapcursor"
import { HardBreak, HardBreakOptions } from "@tiptap/extension-hard-break"
import { Heading, HeadingOptions } from "@tiptap/extension-heading"
import { History, HistoryOptions } from "@tiptap/extension-history"
import {
  HorizontalRule,
  HorizontalRuleOptions,
} from "@tiptap/extension-horizontal-rule"
import { Image, ImageOptions } from "@tiptap/extension-image"
import { Italic, ItalicOptions } from "@tiptap/extension-italic"
import { Link, LinkOptions } from "@tiptap/extension-link"
import { ListItem, ListItemOptions } from "@tiptap/extension-list-item"
import { OrderedList, OrderedListOptions } from "@tiptap/extension-ordered-list"
import { Paragraph, ParagraphOptions } from "@tiptap/extension-paragraph"
import { Placeholder, PlaceholderOptions } from "@tiptap/extension-placeholder"
import { Strike, StrikeOptions } from "@tiptap/extension-strike"
import { Text } from "@tiptap/extension-text"
import { Underline, UnderlineOptions } from "@tiptap/extension-underline"
import { Youtube, YoutubeOptions } from "@tiptap/extension-youtube"

import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { lowlight } from "lowlight"

export interface EditorKitExtensionOptions {
  blockquote: Partial<BlockquoteOptions> | false
  bold: Partial<BoldOptions> | false
  bulletList: Partial<BulletListOptions> | false
  characterCount: Partial<CharacterCountOptions> | false
  code: Partial<CodeOptions> | false
  codeBlockLowlight: Partial<CodeBlockLowlightOptions> | false
  document: false
  dropcursor: Partial<DropcursorOptions> | false
  gapcursor: false
  hardBreak: Partial<HardBreakOptions> | false
  heading: Partial<HeadingOptions> | false
  history: Partial<HistoryOptions> | false
  horizontalRule: Partial<HorizontalRuleOptions> | false
  image: Partial<ImageOptions> | false
  italic: Partial<ItalicOptions> | false
  link: Partial<LinkOptions> | false
  listItem: Partial<ListItemOptions> | false
  orderedList: Partial<OrderedListOptions> | false
  paragraph: Partial<ParagraphOptions> | false
  placeholder: Partial<PlaceholderOptions> | false
  strike: Partial<StrikeOptions> | false
  text: false
  underline: Partial<UnderlineOptions> | false
  youtube: Partial<YoutubeOptions> | false
}

lowlight.registerLanguage("html", html)
lowlight.registerLanguage("css", css)
lowlight.registerLanguage("js", js)
lowlight.registerLanguage("ts", ts)

export const EditorKitExtension = Extension.create<EditorKitExtensionOptions>({
  name: "EditorKitExtension",

  addExtensions() {
    const extensions = []

    if (this.options.blockquote !== false) {
      //@ts-ignore
      extensions.push(Blockquote.configure(this.options?.blockquote))
    }

    if (this.options.bold !== false) {
      //@ts-ignore
      extensions.push(Bold.configure(this.options?.bold))
    }

    if (this.options.bulletList !== false) {
      //@ts-ignore
      extensions.push(BulletList.configure(this.options?.bulletList))
    }

    if (this.options.characterCount !== false) {
      //@ts-ignore
      extensions.push(CharacterCount.configure(this.options?.characterCount))
    }

    if (this.options.code !== false) {
      //@ts-ignore
      extensions.push(Code.configure(this.options?.code))
    }

    if (this.options.codeBlockLowlight !== false) {
      //@ts-ignore
      extensions.push(
        //@ts-ignore
        CodeBlockLowlight.configure({
          lowlight,
        }),
      )
    }

    if (this.options.document !== false) {
      //@ts-ignore
      extensions.push(Document.configure(this.option?.document))
    }

    if (this.options.dropcursor !== false) {
      //@ts-ignore
      extensions.push(Dropcursor.configure(this.options?.dropcursor))
    }

    if (this.options.gapcursor !== false) {
      //@ts-ignore
      extensions.push(Gapcursor.configure(this.options?.gapcursor))
    }

    if (this.options.hardBreak !== false) {
      //@ts-ignore
      extensions.push(HardBreak.configure(this.options?.hardBreak))
    }

    if (this.options.heading !== false) {
      //@ts-ignore
      extensions.push(Heading.configure(this.options?.heading))
    }

    if (this.options.history !== false) {
      //@ts-ignore
      extensions.push(History.configure(this.options?.history))
    }

    if (this.options.horizontalRule !== false) {
      //@ts-ignore
      extensions.push(HorizontalRule.configure(this.options?.horizontalRule))
    }

    if (this.options.image !== false) {
      //@ts-ignore
      extensions.push(Image.configure(this.options?.image))
    }

    if (this.options.italic !== false) {
      //@ts-ignore
      extensions.push(Italic.configure(this.options?.italic))
    }

    if (this.options.link !== false) {
      //@ts-ignore
      extensions.push(Link.configure({ openOnClick: false }))
    }

    if (this.options.listItem !== false) {
      //@ts-ignore
      extensions.push(ListItem.configure(this.options?.listItem))
    }

    if (this.options.orderedList !== false) {
      //@ts-ignore
      extensions.push(OrderedList.configure(this.options?.orderedList))
    }

    if (this.options.paragraph !== false) {
      //@ts-ignore
      extensions.push(Paragraph.configure(this.options?.paragraph))
    }

    if (this.options.placeholder !== false) {
      //@ts-ignore
      extensions.push(
        //@ts-ignore
        Placeholder.configure({ placeholder: "Write Something ..." }),
      )
    }

    if (this.options.strike !== false) {
      //@ts-ignore
      extensions.push(Strike.configure(this.options?.strike))
    }

    if (this.options.text !== false) {
      //@ts-ignore
      extensions.push(Text.configure(this.options?.text))
    }

    if (this.options.underline !== false) {
      //@ts-ignore
      extensions.push(Underline.configure(this.options?.underline))
    }

    if (this.options.youtube !== false) {
      //@ts-ignore
      extensions.push(Youtube.configure(this.options?.youtube))
    }

    return extensions
  },
})
