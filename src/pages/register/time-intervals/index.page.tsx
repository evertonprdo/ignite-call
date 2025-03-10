import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ArrowRight } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
   Button,
   Checkbox,
   Heading,
   MultiStep,
   Text,
   TextInput,
} from '@ignite-ui/react'

import { Container, Header } from '../styles'
import {
   FormError,
   IntervalBox,
   IntervalContainer,
   IntervalDay,
   IntervalInputs,
   IntervalItem,
} from './styles'

import { getWeekDays } from '@/utils/get-week-days'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const timeIntervalsFormSchema = z.object({
   intervals: z
      .array(
         z.object({
            weekDay: z.number().min(0).max(6),
            enabled: z.boolean(),
            startTime: z.string(),
            endTime: z.string(),
         }),
      )
      .length(7)
      .transform((intervals) =>
         intervals.filter((interval) => interval.enabled),
      )
      .refine((intervals) => intervals.length > 0, {
         message: 'Você precisa selecionar pelo menos um dia da semana!',
      })
      .transform((intervals) =>
         intervals.map((interval) => ({
            weekDay: interval.weekDay,
            startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
            endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
         })),
      )
      .refine(
         (intervals) =>
            intervals.every(
               (interval) =>
                  interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
            ),
         {
            message:
               'O horário de término deve ser pelo menos 1h distante do inicio',
         },
      ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.infer<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
   const {
      control,
      register,
      handleSubmit,
      formState: { isSubmitting, errors },
      watch,
   } = useForm<TimeIntervalsFormInput, unknown, TimeIntervalsFormOutput>({
      defaultValues: {
         intervals: [
            {
               weekDay: 0,
               enabled: false,
               startTime: '08:00',
               endTime: '18:00',
            },
            {
               weekDay: 1,
               enabled: true,
               startTime: '08:00',
               endTime: '18:00',
            },
            {
               weekDay: 2,
               enabled: true,
               startTime: '08:00',
               endTime: '18:00',
            },
            {
               weekDay: 3,
               enabled: true,
               startTime: '08:00',
               endTime: '18:00',
            },
            {
               weekDay: 4,
               enabled: true,
               startTime: '08:00',
               endTime: '18:00',
            },
            {
               weekDay: 5,
               enabled: true,
               startTime: '08:00',
               endTime: '18:00',
            },
            {
               weekDay: 6,
               enabled: false,
               startTime: '08:00',
               endTime: '18:00',
            },
         ],
      },
      resolver: zodResolver(timeIntervalsFormSchema),
   })

   const router = useRouter()
   const weekDays = getWeekDays()

   const { fields } = useFieldArray({
      control,
      name: 'intervals',
   })

   const intervals = watch('intervals')

   async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
      await api.post('/users/time-intervals', data)
      await router.push('/register/update-profile')
   }

   return (
      <>
         <NextSeo
            title="Selecione sua disponibilidade | Ignite Call"
            noindex
         />

         <Container>
            <Header>
               <Heading as="strong">Quase lá</Heading>
               <Text>
                  Defina o intervalo de horários que você está disponível em
                  cada dia da semana.
               </Text>

               <MultiStep
                  size={4}
                  currentStep={3}
               />
            </Header>

            <IntervalBox
               as="form"
               onSubmit={handleSubmit(handleSetTimeIntervals)}
            >
               <IntervalContainer>
                  {fields.map((field, i) => (
                     <IntervalItem key={field.id}>
                        <IntervalDay>
                           <Controller
                              name={`intervals.${i}.enabled`}
                              control={control}
                              render={({ field }) => (
                                 <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                       field.onChange(checked === true)
                                    }
                                 />
                              )}
                           />

                           <Text>{weekDays[field.weekDay]}</Text>
                        </IntervalDay>

                        <IntervalInputs>
                           <TextInput
                              size="sm"
                              type="time"
                              step={60}
                              disabled={intervals[i].enabled === false}
                              {...register(`intervals.${i}.startTime`)}
                           />
                           <TextInput
                              size="sm"
                              type="time"
                              step={60}
                              disabled={intervals[i].enabled === false}
                              {...register(`intervals.${i}.endTime`)}
                           />
                        </IntervalInputs>
                     </IntervalItem>
                  ))}
               </IntervalContainer>

               {errors.intervals && (
                  <FormError size="sm">
                     {errors.intervals.root?.message}
                  </FormError>
               )}

               <Button
                  type="submit"
                  disabled={isSubmitting}
               >
                  Próximo passo
                  <ArrowRight />
               </Button>
            </IntervalBox>
         </Container>
      </>
   )
}
