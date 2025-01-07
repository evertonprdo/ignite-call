import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'

import { ArrowRight } from '@phosphor-icons/react'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'

import { api } from '@/lib/axios'
import { Container, Form, FormError, Header } from './styles'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
   username: z
      .string()
      .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
      .regex(/^([a-z\\-]+)$/i, {
         message: 'O usuário pode ter apenas letras e hifens',
      })
      .transform((username) => username.toLowerCase()),
   name: z
      .string()
      .min(3, { message: 'O nome precisa ter pelo menos 3 letras' }),
})

type RegisterFormSchema = z.infer<typeof registerFormSchema>

export default function Register() {
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue,
   } = useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema),
   })

   const router = useRouter()

   async function handleRegister(data: RegisterFormSchema) {
      try {
         await api.post('/users', {
            name: data.name,
            username: data.username,
         })

         await router.push('/register/connect-calendar')
      } catch (error) {
         if (error instanceof AxiosError && error.response?.data?.message) {
            alert(error.response.data.message)
            return
         }
         console.log(error)
      }
   }

   useEffect(() => {
      if (router.query?.username) {
         setValue('username', String(router.query.username))
      }
   }, [router.query?.username, setValue])

   return (
      <>
         <NextSeo title="Crie uma conta | Ignite Call" />
         <Container>
            <Header>
               <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
               <Text>
                  Precisamos de algumas informações para criar seu perfil! Ah,
                  você pode editar essas informações depois.
               </Text>

               <MultiStep
                  size={4}
                  currentStep={1}
               />

               <Form
                  as="form"
                  onSubmit={handleSubmit(handleRegister)}
               >
                  <label>
                     <Text size="sm">Nome de usuário</Text>
                     <TextInput
                        prefix="ignite.com/"
                        placeholder="seu-usuario"
                        {...register('username')}
                     />

                     {errors.username && (
                        <FormError size="sm">
                           {errors.username.message}
                        </FormError>
                     )}
                  </label>

                  <label>
                     <Text size="sm">Nome de completo</Text>
                     <TextInput
                        placeholder="Seu nome"
                        {...register('name')}
                     />

                     {errors.name && (
                        <FormError size="sm">{errors.name.message}</FormError>
                     )}
                  </label>

                  <Button
                     type="submit"
                     disabled={isSubmitting}
                  >
                     Próximo passo
                     <ArrowRight />
                  </Button>
               </Form>
            </Header>
         </Container>
      </>
   )
}
