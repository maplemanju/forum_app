import React from 'react'
import {
  applyListType$,
  currentListType$,
  SingleChoiceToggleGroup,
  iconComponentFor$,
  useTranslation,
} from '@mdxeditor/editor'
import { useCellValues, usePublisher } from '@mdxeditor/gurx'

const ICON_NAME_MAP = {
  bullet: 'format_list_bulleted',
  number: 'format_list_numbered',
} as const

/**
 * A toolbar toggle that allows the user to toggle between bulleted and numbered lists.
 * Pressing the selected button will convert the current list to the other type. Pressing it again will remove the list.
 * For this button to work, you need to have the `listsPlugin` plugin enabled.
 * @group Toolbar Components
 * @param options - The list types that the user can toggle between. Defaults to `['bullet', 'number']`.
 */
export const ListsButton: React.FC<{
  options?: ('bullet' | 'number')[]
}> = ({ options = ['bullet', 'number'] }) => {
  const [currentListType, iconComponentFor] = useCellValues(
    currentListType$,
    iconComponentFor$
  )
  const applyListType = usePublisher(applyListType$)
  const t = useTranslation()

  const LIST_TITLE_MAP = {
    bullet: t('toolbar.bulletedList', 'Bulleted list'),
    number: t('toolbar.numberedList', 'Numbered list'),
  } as const

  const items = options.map((type) => ({
    value: type,
    title: LIST_TITLE_MAP[type],
    contents: iconComponentFor(ICON_NAME_MAP[type]),
  }))

  return (
    <SingleChoiceToggleGroup
      value={currentListType || ''}
      items={items}
      onChange={applyListType}
    />
  )
}
