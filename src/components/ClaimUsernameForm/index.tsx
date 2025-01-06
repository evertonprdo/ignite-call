import { Button, Text } from '@ignite-ui/react'
import { ArrowRight } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Form, FormAnnotation } from './styles'
import { useRouter } from 'next/router'
import { TextInput } from '../TextInput'

const claimUsernameFormSchema = z.object({
   username: z
      .string()
      .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
      .regex(/^([a-z\\-]+)$/i, {
         message: 'O usuário pode ter apenas letras e hifens',
      })
      .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormSchema = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<ClaimUsernameFormSchema>({
      resolver: zodResolver(claimUsernameFormSchema),
   })

   const router = useRouter()

   async function handleClaimUsername(data: ClaimUsernameFormSchema) {
      const { username } = data

      await router.push(`/register?username=${username}`)
   }

   return (
      <>
         <Form
            as="form"
            onSubmit={handleSubmit(handleClaimUsername)}
         >
            <TextInput
               size="sm"
               prefix="ignite.com/"
               placeholder="seu-usuario"
               {...register('username')}
            />
            <Button
               size="sm"
               type="submit"
               disabled={isSubmitting}
            >
               Reservar
               <ArrowRight />
            </Button>
         </Form>
         <FormAnnotation>
            <Text size="sm">
               {errors.username
                  ? errors.username.message
                  : 'Digite o nome do usuário desejado'}
            </Text>
         </FormAnnotation>
      </>
   )
}
