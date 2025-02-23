import { $createQuoteNode, $createHeadingNode } from '@lexical/rich-text'
import { $createParagraphNode } from 'lexical'
import React from 'react'
import {
  convertSelectionToNode$,
  MultipleChoiceToggleGroup,
  currentBlockType$,
} from '@mdxeditor/editor'
import { useCellValue, usePublisher } from '@mdxeditor/gurx'

/**
 * A toolbar button that allows the user to insert a quote or heading.
 * @group Toolbar Components
 */
export const BlockTypesButton: React.FC = () => {
  const convertSelectionToNode = usePublisher(convertSelectionToNode$)
  const currentBlockType = useCellValue(currentBlockType$)

  return (
    <MultipleChoiceToggleGroup
      items={[
        {
          title: 'Quote',
          contents: (
            <div className="flex material-symbols-rounded">format_quote</div>
          ),
          active: currentBlockType === 'quote',
          onChange: () => {
            currentBlockType === 'quote'
              ? convertSelectionToNode(() => $createParagraphNode())
              : convertSelectionToNode(() => $createQuoteNode())
          },
        },

        {
          title: 'Heading 2',
          contents: (
            <div className="flex material-symbols-rounded">format_h2</div>
          ),
          active: currentBlockType === 'h2',
          onChange: () => {
            currentBlockType === 'h2'
              ? convertSelectionToNode(() => $createParagraphNode())
              : convertSelectionToNode(() => $createHeadingNode('h2'))
          },
        },
        {
          title: 'Heading 3',
          contents: (
            <div className="flex material-symbols-rounded">format_h3</div>
          ),
          active: currentBlockType === 'h3',
          onChange: () => {
            currentBlockType === 'h3'
              ? convertSelectionToNode(() => $createParagraphNode())
              : convertSelectionToNode(() => $createHeadingNode('h3'))
          },
        },
      ]}
    />
  )
}
