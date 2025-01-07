import { TextInputProps } from '@ignite-ui/react'

// Override TextInput
declare module '@ignite-ui/react' {
   export function TextInput(props: TextInputProps): JSX.Element
}
