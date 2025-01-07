import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

export default async function handle(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   if (req.method !== 'GET') {
      return res.status(405).end()
   }

   const username = String(req.query.username)
   const { date } = req.query

   if (!date) {
      return res.status(400).json({ message: 'Date not provided' })
   }

   const user = await prisma.user.findUnique({
      where: {
         username,
      },
   })

   if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
   }

   const referenceDate = dayjs(String(date))
   const isPastDate = referenceDate.endOf('day').isBefore(new Date())

   if (isPastDate) {
      return res.json({ possibleTimes: [], availableTimes: [] })
   }

   const userAvailability = await prisma.userTimeInterval.findFirst({
      where: {
         userId: user.id,
         weekDay: referenceDate.get('day'),
      },
   })

   if (!userAvailability) {
      return res.json({ possibleTimes: [], availableTimes: [] })
   }

   const { timeStartInMinutes, timeEndInMinutes } = userAvailability

   const startHour = timeStartInMinutes / 60
   const endHour = timeEndInMinutes / 60

   const possibleTimes = Array.from(
      { length: endHour - startHour },
      (_, i) => startHour + i,
   )

   const blockedTimes = await prisma.scheduling.findMany({
      select: {
         date: true,
      },
      where: {
         userId: user.id,
         date: {
            gte: referenceDate.set('hour', startHour).toDate(),
            lte: referenceDate.set('hour', endHour).toDate(),
         },
      },
   })

   const availableTimes = possibleTimes.filter(
      (time) =>
         !blockedTimes.some(
            (blockedTime) => blockedTime.date.getHours() === time,
         ),
   )
   return res.status(200).json({ possibleTimes, availableTimes })
}
