import { Button } from '@/components/atoms/button'

export const EditorSwitchButton: React.FC<{
  toggleEditor: () => void
  isMdxEditor?: boolean
}> = ({ toggleEditor, isMdxEditor = false }) => {
  return (
    <Button
      leftIcon={isMdxEditor ? 'raw_off' : 'raw_on'}
      color="fade"
      onClick={toggleEditor}
      boxStyle="box"
    />
  )
}
