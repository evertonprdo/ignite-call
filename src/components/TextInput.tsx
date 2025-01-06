import { TextInput as ITextInput, TextInputProps } from '@ignite-ui/react'
import { ForwardRefExoticComponent } from 'react'

type IptType = ForwardRefExoticComponent<TextInputProps>
export const TextInput = ITextInput as IptType
