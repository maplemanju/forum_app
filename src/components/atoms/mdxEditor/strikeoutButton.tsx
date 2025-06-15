'use client'

import React from 'react'
import {
  useTranslation,
  applyFormat$,
  MultipleChoiceToggleGroup,
  currentFormat$,
  IS_STRIKETHROUGH,
} from '@mdxeditor/editor'
import { useCellValues, usePublisher } from '@mdxeditor/gurx'

/**
 * A toolbar button that allows the user to format selected text as a strikeout.
 * @group Toolbar Components
 */
export const StrikeoutButton: React.FC = () => {
  const [currentFormat] = useCellValues(currentFormat$)

  const t = useTranslation()
  const applyFormat = usePublisher(applyFormat$)

  return (
    <MultipleChoiceToggleGroup
      items={[
        {
          title: t('toolbar.strikeout', 'Insert strikeout'),
          contents: (
            <div className="material-symbols-rounded flex">strikethrough_s</div>
          ),
          active: (currentFormat & IS_STRIKETHROUGH) !== 0,
          onChange: () => applyFormat('strikethrough'),
        },
      ]}
    />
  )
}
